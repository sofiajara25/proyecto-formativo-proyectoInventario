// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.
import { pool } from "../../config/db.js";


// Exportamos el repositorio de usuarios.
// El repository encapsula todas las consultas SQL relacionadas con users.
export const returnRepository = {


    // Método encargado de crear un usuario en la base de datos
    // Recibe un objeto con los datos ya validados y procesados por el service
    async create(returnData) {


        // Desestructuramos explícitamente las propiedades esperadas
        // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes
        const {
            materialType,
            loanId,
            returnDate,
            returnDescription,
            returnQuantity,
            isAvailable,
            isMaintenance,
            isLow
        } = returnData;

        // Definimos la consulta SQL parametrizada
        // Usar placeholders ($1, $2, ...) previene inyecciones SQL
        // RETURNING permite obtener datos generados por la base de datos (id)
        const query = `
      INSERT INTO returns (
        material_type,
        loan_id,
        return_date,
        description,
        quantity,
        is_available,
        is_maintenance,
        is_low
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7, $8)
      RETURNING id;
    `;


        // Array de valores que se pasan al query
        // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
        const values = [
            materialType,
            loanId,
            returnDate,
            returnDescription,
            returnQuantity,
            isAvailable,
            isMaintenance,
            isLow
        ];


        // Ejecutamos la consulta usando el pool
        // pool.query retorna un objeto con metadata y filas resultantes
        const result = await pool.query(query, values);


        // Devolvemos únicamente el primer registro retornado
        // En este caso contiene el id del usuario recién creado
        return result.rows[0];
    },

    async findAll() {
        const result = await pool.query("SELECT * FROM returns");
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query("SELECT * FROM returns WHERE id = $1", [id]);
        return result.rows[0]; // debe incluir user_photo
    },

    async update(id, returnData) {

        const {
            materialType,
            loanId,
            returnDate,
            returnDescription,
            returnQuantity,
            isAvailable,
            isMaintenance,
            isLow
        } = returnData;

        const query = `
            UPDATE returns
            SET material_type = $1,
                loan_id = $2,
                return_date = $3,
                description = $4,
                quantity = $5,
                is_available = $6,
                is_maintenance = $7,
                is_low = $8   
            WHERE id = $9
            RETURNING *;
        `;
        const values = [
            materialType,
            loanId,
            returnDate,
            returnDescription,
            returnQuantity,
            isAvailable,
            isMaintenance,
            isLow,
            id
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
};
