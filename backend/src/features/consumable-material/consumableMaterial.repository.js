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
            photo,
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
        photo_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
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
            photo,
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
            photo,
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
                photo_url = COALESCE($12, photo_url)
            WHERE id = $13
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
            photo ?? null,
            id,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

};
