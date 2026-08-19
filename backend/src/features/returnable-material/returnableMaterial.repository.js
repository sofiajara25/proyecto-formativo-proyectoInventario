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
            materialCategory,
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
            brandId
        } = returnableMaterialData;

        // Definimos la consulta SQL parametrizada
        // Usar placeholders ($1, $2, ...) previene inyecciones SQL
        // RETURNING permite obtener datos generados por la base de datos (id)
        const query = `
      INSERT INTO returnable_materials (
        tool_id,
        sena_plate,
        category,
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
        photo_url,
        brand_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING id;
    `;


        // Array de valores que se pasan al query
        // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
        const values = [
            materialToolId,
            materialSenaPlate,
            materialCategory,
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
            brandId
        ];


        // Ejecutamos la consulta usando el pool
        // pool.query retorna un objeto con metadata y filas resultantes
        const result = await pool.query(query, values);


        // Devolvemos únicamente el primer registro retornado
        // En este caso contiene el id del usuario recién creado
        return result.rows[0];
    },

    async findAll() {
        const query = `
    SELECT 
      r.id,
      r.tool_id,
      r.sena_plate,
      r.category,
      r.serial,
      r.material_name,
      r.model,
      r.unit_value,
      r.custodian,
      r.quantity,
      r.status,
      r.total_value,
      r.dimensions,
      r.description,
      r.technical_sheet,
      r.location,
      r.photo_url,
      r.brand_id,
      b.marca AS brand_name
    FROM returnable_materials r
    LEFT JOIN brands b ON r.brand_id = b.id
    ORDER BY r.id;
  `;
        const result = await pool.query(query);
        return result.rows;
    },

    async findById(id) {
        const query = `
    SELECT 
      r.id,
      r.tool_id,
      r.sena_plate,
      r.category,
      r.serial,
      r.material_name,
      r.model,
      r.unit_value,
      r.custodian,
      r.quantity,
      r.status,
      r.total_value,
      r.dimensions,
      r.description,
      r.technical_sheet,
      r.location,
      r.photo_url,
      r.brand_id,
      b.marca AS brand_name
    FROM returnable_materials r
    LEFT JOIN brands b ON r.brand_id = b.id
    WHERE r.id = $1;
  `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },


    async update(id, returnableMaterialData) {
        const {
            materialToolId,
            materialSenaPlate,
            materialCategory,
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
            brandId
        } = returnableMaterialData;

        const query = `
            UPDATE returnable_materials
            SET tool_id = $1,
                sena_plate = $2,
                category =$3,
                serial = $4,
                material_name = $5,
                model = $6,
                unit_value = $7,
                custodian = $8,
                quantity = $9,
                status = $10,
                total_value = $11,
                dimensions = $12,
                description = $13,
                technical_sheet = COALESCE($14, technical_sheet),
                location = $15,
                photo_url = COALESCE($16, photo_url),
                brand_id = $17
            WHERE id = $18
            RETURNING *;
        `;
        const values = [
            materialToolId,
            materialSenaPlate,
            materialCategory,
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
            brandId,
            id
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
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
