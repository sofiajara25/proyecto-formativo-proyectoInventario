// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.
import { pool } from "../../config/db.js";


// Exportamos el repositorio de préstamos.
// El repository encapsula todas las consultas SQL relacionadas con loans
// y loan_items (los materiales asociados a cada préstamo).
export const loanRepository = {


  // Método encargado de crear un préstamo en la base de datos.
  // Un préstamo ahora tiene una cabecera (loans) y uno o más materiales
  // (loan_items), así que la creación se hace dentro de una transacción:
  // si falla la inserción de algún material, no queda un préstamo "vacío".
  async create(loanData) {

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
      photo,
    } = loanData;

    const firstMaterial = Array.isArray(materials) && materials.length ? materials[0] : null;
    const category = firstMaterial?.loanCategory ?? null;
    const productName = firstMaterial?.loanProductName ?? null;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Insertamos la cabecera del préstamo.
      const loanQuery = `
              INSERT INTO loans (
              material_type
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
              )
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
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
        photo,
      ];
      const loanResult = await client.query(loanQuery, loanValues);
      const loan = loanResult.rows[0];

      // 2. Insertamos cada material asociado al préstamo recién creado.
      const itemQuery = `
              INSERT INTO loan_items (loan_id, category, product_name, quantity)
              VALUES ($1,$2,$3,$4)
              RETURNING *;
            `;

      const insertedItems = [];
      for (const material of materials) {
        const itemValues = [
          loan.loan_id,
          material.loanCategory,
          material.loanProductName,
          material.loanQuantity,
        ];
        const itemResult = await client.query(itemQuery, itemValues);
        insertedItems.push(itemResult.rows[0]);
      }

      await client.query("COMMIT");

      return { ...loan, materials: insertedItems };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  // Trae todos los préstamos, más recientes primero, con sus materiales
  // agrupados en un arreglo (json_agg) para no traer filas duplicadas por
  // cada material.
  async findAll() {
    const query = `
          SELECT
            loans.*,
            COALESCE(
              json_agg(
                json_build_object(
                  'id', loan_items.id,
                  'category', loan_items.category,
                  'product_name', loan_items.product_name,
                  'quantity', loan_items.quantity
                )
              ) FILTER (WHERE loan_items.id IS NOT NULL),
              '[]'
            ) AS materials
          FROM loans
          LEFT JOIN loan_items ON loan_items.loan_id = loans.loan_id
          GROUP BY loans.loan_id
          ORDER BY loans.loan_id DESC;
        `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Trae un préstamo por loan_id, junto con sus materiales. Devuelve null si no existe.
  // Usado por GET /api/loan/:loan_id
  async findById(loan_id) {
    const query = `
          SELECT
            loans.*,
            COALESCE(
              json_agg(
                json_build_object(
                  'id', loan_items.id,
                  'category', loan_items.category,
                  'product_name', loan_items.product_name,
                  'quantity', loan_items.quantity
                )
              ) FILTER (WHERE loan_items.id IS NOT NULL),
              '[]'
            ) AS materials
          FROM loans
          LEFT JOIN loan_items ON loan_items.loan_id = loans.loan_id
          WHERE loans.loan_id = $1
          GROUP BY loans.loan_id;
        `;
    const result = await pool.query(query, [loan_id]);
    return result.rows[0] || null;
  },

  // Actualiza los campos editables de la cabecera del préstamo y reemplaza
  // por completo su lista de materiales (se borran los anteriores y se
  // insertan los nuevos, más simple y seguro que intentar hacer un diff).
  // Usado por PUT /api/loan/:loan_id
  async update(loan_id, loanData) {
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
      photo,
    } = loanData;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

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
                photo_url = COALESCE($9, photo_url)
              WHERE loan_id = $10
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
        photo ?? null,
        loan_id,
      ];
      const loanResult = await client.query(loanQuery, loanValues);
      const loan = loanResult.rows[0];

      if (!loan) {
        await client.query("ROLLBACK");
        return null;
      }

      let updatedItems = [];
      if (Array.isArray(materials)) {
        await client.query("DELETE FROM loan_items WHERE loan_id = $1", [loan_id]);

        const itemQuery = `
                  INSERT INTO loan_items (loan_id, category, product_name, quantity)
                  VALUES ($1,$2,$3,$4)
                  RETURNING *;
                `;
        for (const material of materials) {
          const itemValues = [
            loan_id,
            material.loanCategory,
            material.loanProductName,
            material.loanQuantity,
          ];
          const itemResult = await client.query(itemQuery, itemValues);
          updatedItems.push(itemResult.rows[0]);
        }
      }

      await client.query("COMMIT");

      return { ...loan, materials: updatedItems };
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