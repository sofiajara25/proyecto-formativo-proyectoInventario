// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.
import { pool } from "../../config/db.js";

// A qué tabla de materiales pertenece cada tipo de préstamo. Un préstamo
// "Devolutivo" descuenta de returnable_materials, uno "Consumo" de
// consumable_materials. No es un FK real porque loan_items puede apuntar a
// cualquiera de las dos tablas según este tipo (relación polimórfica).
function tableForMaterialType(materialType) {
  if (materialType === "Devolutivo") return "returnable_materials";
  if (materialType === "Consumo") return "consumable_materials";
  return null;
}

// Bloquea la fila del material (FOR UPDATE) para evitar que dos préstamos
// concurrentes descuenten sobre la misma existencia y la dejen negativa.
async function lockMaterialRow(client, table, materialId) {
  const result = await client.query(
    `SELECT id, quantity FROM ${table} WHERE id = $1 FOR UPDATE`,
    [materialId]
  );
  return result.rows[0] || null;
}

// Descuenta "quantity" unidades del material real que respalda un ítem del
// préstamo. Si no hay suficiente disponible, lanza un error (que hace
// ROLLBACK de toda la transacción del préstamo).
async function consumeStock(client, materialType, materialId, quantity, productName) {
  const table = tableForMaterialType(materialType);
  if (!table || !materialId) return; // sin material real vinculado, no hay inventario que tocar

  const row = await lockMaterialRow(client, table, materialId);
  if (!row) {
    throw new Error(`El material "${productName}" ya no existe en el inventario`);
  }
  if (row.quantity < quantity) {
    throw new Error(
      `No hay suficiente cantidad disponible de "${productName}" (disponible: ${row.quantity}, solicitado: ${quantity})`
    );
  }
  await client.query(`UPDATE ${table} SET quantity = quantity - $1 WHERE id = $2`, [quantity, materialId]);
}

// Devuelve "quantity" unidades al material real (se usa al editar un
// préstamo para revertir sus materiales anteriores antes de aplicar los
// nuevos).
async function restoreStock(client, materialType, materialId, quantity) {
  const table = tableForMaterialType(materialType);
  if (!table || !materialId) return;
  await client.query(`UPDATE ${table} SET quantity = quantity + $1 WHERE id = $2`, [quantity, materialId]);
}

// Exportamos el repositorio de préstamos.
// El repository encapsula todas las consultas SQL relacionadas con loans
// y loan_items (los materiales asociados a cada préstamo).
export const loanRepository = {


  // Método encargado de crear un préstamo en la base de datos.
  // Un préstamo ahora tiene una cabecera (loans) y uno o más materiales
  // (loan_items), así que la creación se hace dentro de una transacción:
  // si falla la inserción de algún material, no queda un préstamo "vacío".
  async create(loanData) {

    // "photos" es el arreglo COMPLETO de fotos subidas (puede haber varias);
    // la primera queda como photo_url (portada, compatible con
    // listados/reportes existentes) y el resto se guarda en loan_photos
    // (galería).
    const {
      loanMaterialType,
      loanUser,
      loanUserIdentification,
      loanApprenticeGroup,
      loanDate,
      loanReturnDate,
      loanDescription,
      materials,
      loanType,
      photos,
      isActive,
    } = loanData;

    const firstMaterial = Array.isArray(materials) && materials.length ? materials[0] : null;
    const category = firstMaterial?.loanCategory ?? null;
    const productName = firstMaterial?.loanProductName ?? null;

    const photoList = Array.isArray(photos) ? photos : [];
    const coverPhoto = photoList[0] ?? null;
    const extraPhotos = photoList.slice(1);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Insertamos la cabecera del préstamo.
      // (Antes esta consulta tenía una coma faltante tras "material_type" y
      // una coma sobrante antes del paréntesis final, lo que la hacía
      // inválida y rompía la creación de préstamos. Ya quedó corregida.)
      const loanQuery = `
              INSERT INTO loans (
                material_type,
                loan_user,
                user_identification,
                apprentice_group,
                category,
                product_name,
                loan_date,
                return_date,
                description,
                loan_type,
                photo_url,
                is_active
              )
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
              RETURNING *;
            `;
      const loanValues = [
        loanMaterialType,
        loanUser,
        loanUserIdentification,
        loanApprenticeGroup,
        category,
        productName,
        loanDate,
        loanReturnDate,
        loanDescription,
        loanType,
        coverPhoto,
        isActive ?? true,
      ];
      const loanResult = await client.query(loanQuery, loanValues);
      const loan = loanResult.rows[0];

      // 2. Insertamos cada material asociado al préstamo recién creado y
      // descontamos esa cantidad del material real correspondiente
      // (returnable_materials o consumable_materials según loanMaterialType).
      // Si algún material no tiene suficiente stock, se lanza un error y
      // toda la transacción (préstamo + materiales) se revierte.
      const itemQuery = `
              INSERT INTO loan_items (loan_id, category, product_name, quantity, material_id)
              VALUES ($1,$2,$3,$4,$5)
              RETURNING *;
            `;

      const insertedItems = [];
      for (const material of materials) {
        if (material.materialId) {
          await consumeStock(
            client,
            loanMaterialType,
            material.materialId,
            material.loanQuantity,
            material.loanProductName
          );
        }

        const itemValues = [
          loan.loan_id,
          material.loanCategory,
          material.loanProductName,
          material.loanQuantity,
          material.materialId || null,
        ];
        const itemResult = await client.query(itemQuery, itemValues);
        insertedItems.push(itemResult.rows[0]);
      }

      // 3. Guardamos las fotos extra (2da en adelante) en la galería.
      for (const url of extraPhotos) {
        await client.query(
          "INSERT INTO loan_photos (loan_id, photo_url) VALUES ($1, $2)",
          [loan.loan_id, url]
        );
      }

      await client.query("COMMIT");

      return { ...loan, materials: insertedItems, photos: photoList };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  // Trae todos los préstamos, más recientes primero, con sus materiales y
  // sus fotos (portada + galería) ya combinados en "photos". Usamos
  // subconsultas correlacionadas (en vez de LEFT JOIN + GROUP BY) porque
  // ahora hay DOS relaciones 1-N (materiales y fotos): si se unieran ambas
  // con JOIN normal, cada combinación material×foto generaría una fila de
  // más y los json_agg saldrían duplicados.
  async findAll() {
    const query = `
          SELECT
            loans.*,
            (
              SELECT COALESCE(
                json_agg(
                  json_build_object(
                    'id', li.id,
                    'category', li.category,
                    'product_name', li.product_name,
                    'quantity', li.quantity,
                    'material_id', li.material_id,
                    -- Si ya existe una devolución para este material puntual
                    -- (no para todo el préstamo), no debe volver a ofrecerse
                    -- para devolver.
                    'returned', EXISTS (
                      SELECT 1 FROM returns r WHERE r.loan_item_id = li.id
                    )
                  )
                ),
                '[]'
              )
              FROM loan_items li
              WHERE li.loan_id = loans.loan_id
            ) AS materials,
            (
              SELECT COALESCE(json_agg(lp.photo_url ORDER BY lp.id), '[]')
              FROM loan_photos lp
              WHERE lp.loan_id = loans.loan_id
            ) AS gallery_photos,
            -- "Pendiente" mientras el receptor no haya aceptado el correo de
            -- firma electrónica; NULL si el préstamo no tiene firma asociada
            -- (no se pidió correo al crearlo).
            (
              SELECT ls.status FROM loan_signatures ls
              WHERE ls.loan_id = loans.loan_id
              ORDER BY ls.id DESC LIMIT 1
            ) AS signature_status
          FROM loans
          ORDER BY loans.loan_id ASC;
        `;
    const result = await pool.query(query);
    return result.rows.map(({ gallery_photos, ...row }) => ({
      ...row,
      photos: [row.photo_url, ...gallery_photos].filter(Boolean),
    }));
  },

  // Trae un préstamo por loan_id, junto con sus materiales y sus fotos.
  // Devuelve null si no existe. Usado por GET /api/loan/:loan_id
  async findById(loan_id) {
    const query = `
          SELECT
            loans.*,
            (
              SELECT COALESCE(
                json_agg(
                  json_build_object(
                    'id', li.id,
                    'category', li.category,
                    'product_name', li.product_name,
                    'quantity', li.quantity,
                    'material_id', li.material_id,
                    'returned', EXISTS (
                      SELECT 1 FROM returns r WHERE r.loan_item_id = li.id
                    )
                  )
                ),
                '[]'
              )
              FROM loan_items li
              WHERE li.loan_id = loans.loan_id
            ) AS materials,
            (
              SELECT COALESCE(json_agg(lp.photo_url ORDER BY lp.id), '[]')
              FROM loan_photos lp
              WHERE lp.loan_id = loans.loan_id
            ) AS gallery_photos,
            (
              SELECT ls.status FROM loan_signatures ls
              WHERE ls.loan_id = loans.loan_id
              ORDER BY ls.id DESC LIMIT 1
            ) AS signature_status
          FROM loans
          WHERE loans.loan_id = $1;
        `;
    const result = await pool.query(query, [loan_id]);
    const row = result.rows[0];
    if (!row) return null;

    const { gallery_photos, ...rest } = row;
    return { ...rest, photos: [row.photo_url, ...gallery_photos].filter(Boolean) };
  },

  // Actualiza los campos editables de la cabecera del préstamo, reemplaza
  // por completo su lista de materiales, y reemplaza por completo su
  // galería de fotos extra (se borran las anteriores y se insertan las
  // nuevas, más simple y seguro que intentar hacer un diff).
  // Usado por PUT /api/loan/:loan_id
  async update(loan_id, loanData) {
    // "photos" es el arreglo FINAL deseado de fotos (las que el usuario
    // decidió mantener + las que subió nuevas, en ese orden). La primera
    // queda como portada (photo_url); el resto reemplaza la galería.
    const {
      loanMaterialType,
      loanUser,
      loanUserIdentification,
      loanApprenticeGroup,
      loanDate,
      loanReturnDate,
      loanDescription,
      materials,
      loanType,
      photos,
      isActive,
    } = loanData;

    const photoList = Array.isArray(photos) ? photos : [];
    const coverPhoto = photoList[0] ?? null;
    const extraPhotos = photoList.slice(1);

    // "category" y "product_name" en la tabla loans son un respaldo del
    // PRIMER material (los usa, por ejemplo, la lista de préstamos). Antes
    // el UPDATE nunca los tocaba, así que si editabas los materiales de un
    // préstamo, la lista seguía mostrando el material viejo para siempre.
    const firstMaterial = Array.isArray(materials) && materials.length ? materials[0] : null;
    const category = firstMaterial?.loanCategory ?? null;
    const productName = firstMaterial?.loanProductName ?? null;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Leemos el tipo de material VIGENTE (antes de aplicar este update)
      // para saber a qué tabla devolver el stock de los materiales
      // anteriores del préstamo, por si se reemplazan.
      const previousLoanResult = await client.query(
        "SELECT material_type FROM loans WHERE loan_id = $1",
        [loan_id]
      );
      const previousMaterialType = previousLoanResult.rows[0]?.material_type;

      const loanQuery = `
              UPDATE loans
              SET
              material_type = $1,
                loan_user = $2,
                user_identification = $3,
                apprentice_group = $4,
                loan_date = $5,
                return_date = $6,
                description = $7,
                loan_type = $8,
                photo_url = COALESCE($9, photo_url),
                is_active = COALESCE($10, is_active),
                category = COALESCE($12, category),
                product_name = COALESCE($13, product_name)
              WHERE loan_id = $11
              RETURNING *;
            `;
      const loanValues = [
        loanMaterialType,
        loanUser,
        loanUserIdentification,
        loanApprenticeGroup,
        loanDate,
        loanReturnDate,
        loanDescription,
        loanType,
        coverPhoto,
        isActive ?? null,
        loan_id,
        category,
        productName,
      ];
      const loanResult = await client.query(loanQuery, loanValues);
      const loan = loanResult.rows[0];

      if (!loan) {
        await client.query("ROLLBACK");
        return null;
      }

      let updatedItems = [];
      if (Array.isArray(materials)) {
        // 1. Devolvemos el stock de los materiales que tenía el préstamo
        // ANTES de este cambio (se van a reemplazar por los nuevos).
        const oldItemsResult = await client.query(
          "SELECT material_id, quantity FROM loan_items WHERE loan_id = $1",
          [loan_id]
        );
        for (const item of oldItemsResult.rows) {
          if (item.material_id) {
            await restoreStock(client, previousMaterialType, item.material_id, item.quantity);
          }
        }

        await client.query("DELETE FROM loan_items WHERE loan_id = $1", [loan_id]);

        // 2. Insertamos los materiales nuevos y descontamos su stock
        // (con el tipo de material ya actualizado de este mismo submit).
        const itemQuery = `
                  INSERT INTO loan_items (loan_id, category, product_name, quantity, material_id)
                  VALUES ($1,$2,$3,$4,$5)
                  RETURNING *;
                `;
        for (const material of materials) {
          if (material.materialId) {
            await consumeStock(
              client,
              loanMaterialType,
              material.materialId,
              material.loanQuantity,
              material.loanProductName
            );
          }

          const itemValues = [
            loan_id,
            material.loanCategory,
            material.loanProductName,
            material.loanQuantity,
            material.materialId || null,
          ];
          const itemResult = await client.query(itemQuery, itemValues);
          updatedItems.push(itemResult.rows[0]);
        }
      }

      if (Array.isArray(photos)) {
        await client.query("DELETE FROM loan_photos WHERE loan_id = $1", [loan_id]);
        for (const url of extraPhotos) {
          await client.query(
            "INSERT INTO loan_photos (loan_id, photo_url) VALUES ($1, $2)",
            [loan_id, url]
          );
        }
      }

      await client.query("COMMIT");

      return {
        ...loan,
        materials: updatedItems,
        photos: photoList.length ? photoList : [loan.photo_url].filter(Boolean),
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  // Actualiza únicamente el estado del préstamo (activo/devuelto/cancelado/atrasado).
  // Usado por PUT /api/loan/:loan_id/status
  async updateStatus(loan_id, is_active) {
    const query = `
      UPDATE loans
      SET is_active = $1
      WHERE loan_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [is_active, loan_id]);
    return result.rows[0] || null;
  },
};