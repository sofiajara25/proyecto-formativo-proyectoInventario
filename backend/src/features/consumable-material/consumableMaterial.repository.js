// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.
import { pool } from "../../config/db.js";

// Exportamos el repositorio de usuarios.
// El repository encapsula todas las consultas SQL relacionadas con users.
export const consumableMaterialRepository = {


    // Método encargado de crear un usuario en la base de datos
    // Recibe un objeto con los datos ya validados y procesados por el service
    async create(consumableMaterialData) {


        // Desestructuramos explícitamente las propiedades esperadas.
        // materialToolId YA NO se recibe del cliente: el ID de herramienta
        // se genera automáticamente a partir del id real del registro.
        // "photos" es el arreglo COMPLETO de fotos subidas (puede haber
        // varias); la primera queda como photo_url (portada, compatible con
        // listados/reportes existentes) y el resto se guarda en la tabla
        // consumable_material_photos (galería).
        const {
            materialAccountants,
            materialSenaPlate,
            materialName,
            materialEntryDate,
            materialPurchaseDate,
            materialQuantity,
            inventoryNameId,
            materialLocation,
            materialUnitValue,
            materialTotalValue,
            materialStatus,
            materialDescription,
            materialTechnicalSheet,
            photos,
            brandId,
            categoryId,
            quotationIds,
        } = consumableMaterialData;

        const quotationIdList = Array.isArray(quotationIds) ? quotationIds : [];
        const accountantList = Array.isArray(materialAccountants) ? materialAccountants : [];

        const photoList = Array.isArray(photos) ? photos : [];
        const coverPhoto = photoList[0] ?? null;
        const extraPhotos = photoList.slice(1);

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            // 1. Insertamos el registro con un tool_id temporal (la columna es
            // NOT NULL, así que no puede ir vacío) para poder obtener el id
            // real generado por la base de datos.
            const insertQuery = `
        INSERT INTO consumable_materials (
          accountants,
          tool_id,
          sena_plate,
          material_name,
          entry_date,
          purchase_date,
          quantity,
          inventory_name_id,
          location,
          unit_value,
          total_value,
          status,
          description,
          technical_sheet,
          photo_url,
          brand_id,
          category_id
        )
        VALUES ($1,'PENDIENTE',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
        RETURNING id;
      `;

            const insertValues = [
                accountantList,
                materialSenaPlate,
                materialName,
                materialEntryDate,
                materialPurchaseDate ?? null,
                materialQuantity,
                inventoryNameId,
                materialLocation,
                materialUnitValue,
                materialTotalValue,
                materialStatus,
                materialDescription,
                materialTechnicalSheet,
                coverPhoto,
                // Si no se seleccionó marca, brandId llega undefined (el
                // campo ni siquiera viaja en el form-data). pg no acepta
                // undefined como parámetro, así que lo convertimos a null.
                brandId ?? null,
                categoryId ?? null,
            ];

            const insertResult = await client.query(insertQuery, insertValues);
            const { id } = insertResult.rows[0];

            // 2. Con el id real ya generado, construimos el tool_id definitivo
            // (ej. CON-0001) y lo guardamos.
            const toolId = `CON-${String(id).padStart(4, "0")}`;

            const updateResult = await client.query(
                "UPDATE consumable_materials SET tool_id = $1 WHERE id = $2 RETURNING *",
                [toolId, id]
            );

            // 3. Guardamos las fotos extra (2da en adelante) en la galería.
            for (const url of extraPhotos) {
                await client.query(
                    "INSERT INTO consumable_material_photos (consumable_material_id, photo_url) VALUES ($1, $2)",
                    [id, url]
                );
            }

            // 4. Enlazamos las cotizaciones elegidas (1-3, ya existentes en
            // el catálogo "quotations"; aquí no se sube ningún PDF nuevo).
            for (const quotationId of quotationIdList) {
                await client.query(
                    "INSERT INTO consumable_material_quotations (consumable_material_id, quotation_id) VALUES ($1, $2)",
                    [id, quotationId]
                );
            }

            await client.query("COMMIT");

            return { ...updateResult.rows[0], photos: photoList };
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    },

    // Calcula cuál sería el próximo id (y por lo tanto el próximo tool_id)
    // SIN crear nada todavía. Se usa para mostrarlo en el formulario de
    // creación antes de guardar. Es una vista previa: si otro usuario crea
    // un material justo antes que tú, el id real puede correrse en 1.
    async getNextId() {
        const result = await pool.query(
            "SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM consumable_materials"
        );
        return Number(result.rows[0].next_id);
    },

    // Trae la portada (photo_url) + las fotos extra de la galería, ya
    // combinadas en un solo arreglo "photos" (portada primero).
    async findAll() {
        const result = await pool.query(`
            SELECT
                m.*,
                b.marca AS brand_name,
                inv.inventory_name AS inventory_name,
                c.category_name AS category_name,
                c.element_type AS category_element_type,
                COALESCE(
                    json_agg(mp.photo_url ORDER BY mp.id) FILTER (WHERE mp.photo_url IS NOT NULL),
                    '[]'
                ) AS gallery_photos,
                -- Subconsulta (no JOIN) para las cotizaciones enlazadas: si
                -- se unieran directamente fotos Y cotizaciones en el mismo
                -- JOIN, el producto cruzado duplicaría filas y los json_agg
                -- saldrían mal (ej. 2 fotos x 2 cotizaciones = 4 filas).
                COALESCE(
                    (SELECT json_agg(json_build_object(
                        'quotation_id', q.quotation_id,
                        'quotation_name', q.quotation_name,
                        'pdf_url', q.pdf_url
                    ))
                    FROM consumable_material_quotations cmq
                    JOIN quotations q ON q.quotation_id = cmq.quotation_id
                    WHERE cmq.consumable_material_id = m.id),
                    '[]'
                ) AS quotations
            FROM consumable_materials m
            LEFT JOIN brands b ON b.id = m.brand_id
            LEFT JOIN inventory_names inv ON inv.inventory_name_id = m.inventory_name_id
            LEFT JOIN categorys c ON c.category_id = m.category_id
            LEFT JOIN consumable_material_photos mp ON mp.consumable_material_id = m.id
            GROUP BY m.id, b.marca, inv.inventory_name, c.category_name, c.element_type
            ORDER BY m.id;
        `);
        return result.rows.map(({ gallery_photos, ...row }) => ({
            ...row,
            photos: [row.photo_url, ...gallery_photos].filter(Boolean),
        }));
    },

    async findById(id) {
        const result = await pool.query(`
            SELECT
                m.*,
                b.marca AS brand_name,
                inv.inventory_name AS inventory_name,
                c.category_name AS category_name,
                c.element_type AS category_element_type,
                COALESCE(
                    json_agg(mp.photo_url ORDER BY mp.id) FILTER (WHERE mp.photo_url IS NOT NULL),
                    '[]'
                ) AS gallery_photos,
                COALESCE(
                    (SELECT json_agg(json_build_object(
                        'quotation_id', q.quotation_id,
                        'quotation_name', q.quotation_name,
                        'pdf_url', q.pdf_url
                    ))
                    FROM consumable_material_quotations cmq
                    JOIN quotations q ON q.quotation_id = cmq.quotation_id
                    WHERE cmq.consumable_material_id = m.id),
                    '[]'
                ) AS quotations
            FROM consumable_materials m
            LEFT JOIN brands b ON b.id = m.brand_id
            LEFT JOIN inventory_names inv ON inv.inventory_name_id = m.inventory_name_id
            LEFT JOIN categorys c ON c.category_id = m.category_id
            LEFT JOIN consumable_material_photos mp ON mp.consumable_material_id = m.id
            WHERE m.id = $1
            GROUP BY m.id, b.marca, inv.inventory_name, c.category_name, c.element_type;
        `, [id]);

        const row = result.rows[0];
        if (!row) return null;

        const { gallery_photos, ...rest } = row;
        return { ...rest, photos: [row.photo_url, ...gallery_photos].filter(Boolean) };
    },

    async update(id, consumableData) {
        // "photos" es el arreglo FINAL deseado de fotos (las que el usuario
        // decidió mantener + las que subió nuevas, en ese orden). La
        // primera queda como portada (photo_url); el resto reemplaza por
        // completo la galería (se borra y se vuelve a insertar, igual que
        // se hace con los materiales de un préstamo: más simple y seguro
        // que intentar calcular un diff).
        const {
            materialAccountants,
            materialToolId,
            materialSenaPlate,
            materialName,
            materialEntryDate,
            materialPurchaseDate,
            materialQuantity,
            inventoryNameId,
            materialLocation,
            materialUnitValue,
            materialTotalValue,
            materialStatus,
            materialDescription,
            materialTechnicalSheet,
            photos,
            brandId,
            categoryId,
            quotationIds,
        } = consumableData;

        const accountantList = Array.isArray(materialAccountants) ? materialAccountants : [];
        const photoList = Array.isArray(photos) ? photos : [];
        const coverPhoto = photoList[0] ?? null;
        const extraPhotos = photoList.slice(1);

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const query = `
                UPDATE consumable_materials
                SET accountants = $1,
                    tool_id = $2,
                    sena_plate = $3,
                    material_name = $4,
                    entry_date = $5,
                    purchase_date = $6,
                    quantity = $7,
                    inventory_name_id = $8,
                    location = $9,
                    unit_value = $10,
                    total_value = $11,
                    status = $12,
                    description = $13,
                    technical_sheet = COALESCE($14, technical_sheet),
                    photo_url = COALESCE($15, photo_url),
                    brand_id = $16,
                    category_id = $17
                WHERE id = $18
                RETURNING *;
            `;

            const values = [
                accountantList,
                materialToolId,
                materialSenaPlate,
                materialName,
                materialEntryDate,
                materialPurchaseDate ?? null,
                materialQuantity,
                inventoryNameId ?? null,
                materialLocation,
                materialUnitValue,
                materialTotalValue,
                materialStatus,
                materialDescription,
                materialTechnicalSheet ?? null,
                coverPhoto,
                brandId ?? null,
                categoryId ?? null,
                id,
            ];

            const result = await client.query(query, values);
            const updated = result.rows[0];

            if (!updated) {
                await client.query("ROLLBACK");
                return null;
            }

            if (Array.isArray(photos)) {
                await client.query(
                    "DELETE FROM consumable_material_photos WHERE consumable_material_id = $1",
                    [id]
                );
                for (const url of extraPhotos) {
                    await client.query(
                        "INSERT INTO consumable_material_photos (consumable_material_id, photo_url) VALUES ($1, $2)",
                        [id, url]
                    );
                }
            }

            // Igual que con las fotos: se reemplaza el enlace completo con
            // la selección final de cotizaciones (borrar + reinsertar es
            // más simple y seguro que calcular un diff).
            if (Array.isArray(quotationIds)) {
                await client.query(
                    "DELETE FROM consumable_material_quotations WHERE consumable_material_id = $1",
                    [id]
                );
                for (const quotationId of quotationIds) {
                    await client.query(
                        "INSERT INTO consumable_material_quotations (consumable_material_id, quotation_id) VALUES ($1, $2)",
                        [id, quotationId]
                    );
                }
            }

            await client.query("COMMIT");

            return { ...updated, photos: photoList.length ? photoList : [updated.photo_url].filter(Boolean) };
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    },

    // Descuenta (o repone, si amount es negativo) la cantidad disponible de un material.
    // Se usa al aprobar un préstamo para reflejar que esas unidades ya no están libres.
    async adjustQuantity(id, amount) {
        const query = `
      UPDATE consumable_materials
      SET quantity = quantity - $2
      WHERE id = $1
      RETURNING id, quantity;
    `;

        const result = await pool.query(query, [id, amount]);
        return result.rows[0];
    },

    async updateStatus(id, status) {
        const query = `
            UPDATE consumable_materials
            SET status = $1
            WHERE id = $2
            RETURNING *;
        `;
        const values = [status, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

};
