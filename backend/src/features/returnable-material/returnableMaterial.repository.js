// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.
import { pool } from "../../config/db.js";


// Exportamos el repositorio de usuarios.
// El repository encapsula todas las consultas SQL relacionadas con users.
export const returnableMaterialRepository = {


    // Método encargado de crear un usuario en la base de datos
    // Recibe un objeto con los datos ya validados y procesados por el service
    async create(returnableMaterialData) {


        // Desestructuramos explícitamente las propiedades esperadas.
        // materialToolId YA NO se recibe del cliente: el ID de herramienta
        // se genera automáticamente a partir del id real del registro.
        // "photos" es el arreglo COMPLETO de fotos subidas (puede haber
        // varias); la primera queda como photo_url (portada, compatible con
        // listados/reportes existentes) y el resto se guarda en la tabla
        // returnable_material_photos (galería).
        const {
            materialSenaPlate,
            categoryId,
            materialSerial,
            materialName,
            materialModel,
            materialUnitValue,
            materialCustodians,
            materialQuantity,
            materialStatus,
            materialTotalValue,
            materialDimensions,
            materialDescription,
            materialTechnicalSheet,
            inventoryNameId,
            materialLocation,
            photos,
            brandId,
            quotationIds,
        } = returnableMaterialData;

        const quotationIdList = Array.isArray(quotationIds) ? quotationIds : [];
        const custodianList = Array.isArray(materialCustodians) ? materialCustodians : [];
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
        INSERT INTO returnable_materials (
          tool_id,
          sena_plate,
          category_id,
          serial,
          material_name,
          model,
          unit_value,
          custodians,
          quantity,
          status,
          total_value,
          dimensions,
          description,
          technical_sheet,
          inventory_name_id,
          location,
          photo_url,
          brand_id
        )
        VALUES ('PENDIENTE',$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
        RETURNING id;
      `;

            const insertValues = [
                materialSenaPlate,
                categoryId ?? null,
                materialSerial,
                materialName,
                materialModel,
                materialUnitValue,
                custodianList,
                materialQuantity,
                materialStatus,
                materialTotalValue,
                materialDimensions,
                materialDescription,
                materialTechnicalSheet,
                inventoryNameId ?? null,
                materialLocation,
                coverPhoto,
                // Si no se seleccionó marca, brandId llega undefined (el
                // campo ni siquiera viaja en el form-data). pg no acepta
                // undefined como parámetro, así que lo convertimos a null.
                brandId ?? null
            ];

            const insertResult = await client.query(insertQuery, insertValues);
            const { id } = insertResult.rows[0];

            // 2. Con el id real ya generado, construimos el tool_id definitivo
            // (ej. DEV-0001) y lo guardamos.
            const toolId = `DEV-${String(id).padStart(4, "0")}`;

            const updateResult = await client.query(
                "UPDATE returnable_materials SET tool_id = $1 WHERE id = $2 RETURNING *",
                [toolId, id]
            );

            // 3. Guardamos las fotos extra (2da en adelante) en la galería.
            for (const url of extraPhotos) {
                await client.query(
                    "INSERT INTO returnable_material_photos (returnable_material_id, photo_url) VALUES ($1, $2)",
                    [id, url]
                );
            }

            // 4. Enlazamos las cotizaciones elegidas (1-3, ya existentes en
            // el catálogo "quotations").
            for (const quotationId of quotationIdList) {
                await client.query(
                    "INSERT INTO returnable_material_quotations (returnable_material_id, quotation_id) VALUES ($1, $2)",
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
            "SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM returnable_materials"
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
                COALESCE(
                    (SELECT json_agg(json_build_object(
                        'quotation_id', q.quotation_id,
                        'quotation_name', q.quotation_name,
                        'pdf_url', q.pdf_url
                    ))
                    FROM returnable_material_quotations rmq
                    JOIN quotations q ON q.quotation_id = rmq.quotation_id
                    WHERE rmq.returnable_material_id = m.id),
                    '[]'
                ) AS quotations
            FROM returnable_materials m
            LEFT JOIN brands b ON b.id = m.brand_id
            LEFT JOIN inventory_names inv ON inv.inventory_name_id = m.inventory_name_id
            LEFT JOIN categorys c ON c.category_id = m.category_id
            LEFT JOIN returnable_material_photos mp ON mp.returnable_material_id = m.id
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
                    FROM returnable_material_quotations rmq
                    JOIN quotations q ON q.quotation_id = rmq.quotation_id
                    WHERE rmq.returnable_material_id = m.id),
                    '[]'
                ) AS quotations
            FROM returnable_materials m
            LEFT JOIN brands b ON b.id = m.brand_id
            LEFT JOIN inventory_names inv ON inv.inventory_name_id = m.inventory_name_id
            LEFT JOIN categorys c ON c.category_id = m.category_id
            LEFT JOIN returnable_material_photos mp ON mp.returnable_material_id = m.id
            WHERE m.id = $1
            GROUP BY m.id, b.marca, inv.inventory_name, c.category_name, c.element_type;
        `, [id]);

        const row = result.rows[0];
        if (!row) return null;

        const { gallery_photos, ...rest } = row;
        return { ...rest, photos: [row.photo_url, ...gallery_photos].filter(Boolean) };
    },

    async update(id, returnableMaterialData) {
        // "photos" es el arreglo FINAL deseado de fotos (las que el usuario
        // decidió mantener + las que subió nuevas, en ese orden). La
        // primera queda como portada (photo_url); el resto reemplaza por
        // completo la galería (se borra y se vuelve a insertar).
        const {
            materialToolId,
            materialSenaPlate,
            categoryId,
            materialSerial,
            materialName,
            materialModel,
            materialUnitValue,
            materialCustodians,
            materialQuantity,
            materialStatus,
            materialTotalValue,
            materialDimensions,
            materialDescription,
            materialTechnicalSheet,
            inventoryNameId,
            materialLocation,
            photos,
            brandId,
            quotationIds,
        } = returnableMaterialData;

        const custodianList = Array.isArray(materialCustodians) ? materialCustodians : [];
        const photoList = Array.isArray(photos) ? photos : [];
        const coverPhoto = photoList[0] ?? null;
        const extraPhotos = photoList.slice(1);

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const query = `
                UPDATE returnable_materials
                SET tool_id = $1,
                    sena_plate = $2,
                    category_id = $3,
                    serial = $4,
                    material_name = $5,
                    model = $6,
                    unit_value = $7,
                    custodians = $8,
                    quantity = $9,
                    status = $10,
                    total_value = $11,
                    dimensions = $12,
                    description = $13,
                    technical_sheet = COALESCE($14, technical_sheet),
                    inventory_name_id = $15,
                    location = $16,
                    photo_url = COALESCE($17, photo_url),
                    brand_id = $18
                WHERE id = $19
                RETURNING *;
            `;
            const values = [
                materialToolId,
                materialSenaPlate,
                categoryId ?? null,
                materialSerial,
                materialName,
                materialModel,
                materialUnitValue,
                custodianList,
                materialQuantity,
                materialStatus,
                materialTotalValue,
                materialDimensions,
                materialDescription,
                materialTechnicalSheet ?? null,
                inventoryNameId ?? null,
                materialLocation,
                coverPhoto,
                brandId ?? null,
                id
            ];

            const result = await client.query(query, values);
            const updated = result.rows[0];

            if (!updated) {
                await client.query("ROLLBACK");
                return null;
            }

            if (Array.isArray(photos)) {
                await client.query(
                    "DELETE FROM returnable_material_photos WHERE returnable_material_id = $1",
                    [id]
                );
                for (const url of extraPhotos) {
                    await client.query(
                        "INSERT INTO returnable_material_photos (returnable_material_id, photo_url) VALUES ($1, $2)",
                        [id, url]
                    );
                }
            }

            if (Array.isArray(quotationIds)) {
                await client.query(
                    "DELETE FROM returnable_material_quotations WHERE returnable_material_id = $1",
                    [id]
                );
                for (const quotationId of quotationIds) {
                    await client.query(
                        "INSERT INTO returnable_material_quotations (returnable_material_id, quotation_id) VALUES ($1, $2)",
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

    async adjustQuantity(id, amount) {
        const query = `
      UPDATE returnable_materials
      SET quantity = quantity - $2
      WHERE id = $1
      RETURNING id, quantity;
    `;

        const result = await pool.query(query, [id, amount]);
        return result.rows[0];
    },

    // returnableMaterial.repository.js
    async updateStatus(id, status) {
        const query = `
            UPDATE returnable_materials
            SET status = $1
            WHERE id = $2
            RETURNING *;
         `;
        const values = [status, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }


};
