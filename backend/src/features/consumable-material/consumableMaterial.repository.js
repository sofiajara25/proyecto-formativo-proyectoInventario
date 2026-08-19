// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.
import { pool } from "../../config/db.js";

// Exportamos el repositorio de usuarios.
// El repository encapsula todas las consultas SQL relacionadas con users.
export const consumableMaterialRepository = {


    // Método encargado de crear un usuario en la base de datos
    // Recibe un objeto con los datos ya validados y procesados por el service
    async create(consumableMaterialData) {


        // Desestructuramos explícitamente las propiedades esperadas
        // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes
        const {
            materialAccountant,
            materialToolId,
            materialSenaPlate,
            materialName,
            materialEntryDate,
            materialQuantity,
            materialLocation,
            materialUnitValue,
            materialTotalValue,
            materialStatus,
            materialDescription,
            materialTechnicalSheet,
            photo,
            brandId,
        } = consumableMaterialData;

        // Definimos la consulta SQL parametrizada
        // Usar placeholders ($1, $2, ...) previene inyecciones SQL
        // RETURNING permite obtener datos generados por la base de datos (id)
        const query = `
      INSERT INTO consumable_materials (
        accountant,
        tool_id,
        sena_plate,
        material_name,
        entry_date,
        quantity,
        location,
        unit_value,
        total_value,
        status,
        description,
        technical_sheet,
        photo_url,
        brand_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING id;
    `;


        // Array de valores que se pasan al query
        // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
        const values = [
            materialAccountant,
            materialToolId,
            materialSenaPlate,
            materialName,
            materialEntryDate,
            materialQuantity,
            materialLocation,
            materialUnitValue,
            materialTotalValue,
            materialStatus,
            materialDescription,
            materialTechnicalSheet,
            photo,
            brandId,
        ];


        // Ejecutamos la consulta usando el pool
        // pool.query retorna un objeto con metadata y filas resultantes
        const result = await pool.query(query, values);


        // Devolvemos únicamente el primer registro retornado
        // En este caso contiene el id del usuario recién creado
        return result.rows[0];
    },

    async findAll() {
        const result = await pool.query("SELECT * FROM consumable_materials");
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query("SELECT * FROM consumable_materials WHERE id = $1", [id]);
        return result.rows[0];
    },

    async update(id, consumableData) {
        const {
            materialAccountant,
            materialToolId,
            materialSenaPlate,
            materialName,
            materialEntryDate,
            materialQuantity,
            materialLocation,
            materialUnitValue,
            materialTotalValue,
            materialStatus,
            materialDescription,
            materialTechnicalSheet,
            photo,
            brandId,
        } = consumableData;

        const query = `
            UPDATE consumable_materials
            SET accountant = $1,
                tool_id = $2,
                sena_plate = $3,
                material_name = $4,
                entry_date = $5,
                quantity = $6,
                location = $7,
                unit_value = $8,
                total_value = $9,
                status = $10,
                description = $11,
                technical_sheet = COALESCE($12, technical_sheet),
                photo_url = COALESCE($13, photo_url),
                brand_id = $14
            WHERE id = $15
            RETURNING *;
        `;

        const values = [
            materialAccountant,
            materialToolId,
            materialSenaPlate,
            materialName,
            materialEntryDate,
            materialQuantity,
            materialLocation,
            materialUnitValue,
            materialTotalValue,
            materialStatus,
            materialDescription,
            materialTechnicalSheet ?? null,
            photo ?? null,
            brandId,
            id,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
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
