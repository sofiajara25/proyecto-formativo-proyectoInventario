// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.
import { pool } from "../../config/db.js";


// Exportamos el repositorio de usuarios.
// El repository encapsula todas las consultas SQL relacionadas con users.
export const returnableMaterialRepository = {


    // Método encargado de crear un usuario en la base de datos
    // Recibe un objeto con los datos ya validados y procesados por el service
    async create(returnableMaterialData) {


        // Desestructuramos explícitamente las propiedades esperadas
        // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes
        const {
            materialToolId,
            materialSenaPlate,
            materialSerial,
            materialName,
            materialModel,
            materialUnitValue,
            materialCustodian,
            materialQuantity,
            materialStatus,
            materialTotalValue,
            materialDimensions,
            materialDescription,
            materialTechnicalSheet,
            materialLocation,
            photo,
        } = returnableMaterialData;

        // Definimos la consulta SQL parametrizada
        // Usar placeholders ($1, $2, ...) previene inyecciones SQL
        // RETURNING permite obtener datos generados por la base de datos (id)
        const query = `
      INSERT INTO returnable_materials (
        tool_id,
        sena_plate,
        serial,
        material_name,
        model,
        unit_value,
        custodian,
        quantity,
        status,
        total_value,
        dimensions,
        description,
        technical_sheet,
        location,
        photo_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING id;
    `;


        // Array de valores que se pasan al query
        // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
        const values = [
            materialToolId,
            materialSenaPlate,
            materialSerial,
            materialName,
            materialModel,
            materialUnitValue,
            materialCustodian,
            materialQuantity,
            materialStatus,
            materialTotalValue,
            materialDimensions,
            materialDescription,
            materialTechnicalSheet,
            materialLocation,
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
        const result = await pool.query("SELECT * FROM returnable_materials");
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query("SELECT * FROM returnable_materials WHERE id = $1", [id]);
        return result.rows[0];
    },

    async update(id, returnableMaterialData) {
        const {
            materialToolId,
            materialSenaPlate,
            materialSerial,
            materialName,
            materialModel,
            materialUnitValue,
            materialCustodian,
            materialQuantity,
            materialStatus,
            materialTotalValue,
            materialDimensions,
            materialDescription,
            materialTechnicalSheet,
            materialLocation,
            photo,
        } = returnableMaterialData;

        const query = `
            UPDATE returnable_materials
            SET tool_id = $1,
                sena_plate = $2,
                serial = $3,
                material_name = $4,
                model = $5,
                unit_value = $6,
                custodian = $7,
                quantity = $8,
                status = $9,
                total_value = $10,
                dimensions = $11,
                description = $12,
                technical_sheet = COALESCE($13, technical_sheet),
                location = $14,
                photo_url = COALESCE($15, photo_url)
            WHERE id = $16
            RETURNING *;
        `;
        const values = [
            materialToolId,
            materialSenaPlate,
            materialSerial,
            materialName,
            materialModel,
            materialUnitValue,
            materialCustodian,
            materialQuantity,
            materialStatus,
            materialTotalValue,
            materialDimensions,
            materialDescription,
            materialTechnicalSheet ?? null,
            materialLocation,
            photo ?? null,
            id
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

};
