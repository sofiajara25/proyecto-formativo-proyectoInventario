// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.
import { pool } from "../../config/db.js";


// Exportamos el repositorio de usuarios.
// El repository encapsula todas las consultas SQL relacionadas con users.
export const inventoryNameRepository = {


    // Método encargado de crear un usuario en la base de datos
    // Recibe un objeto con los datos ya validados y procesados por el service
    async create(inventoryNameData) {


        // Desestructuramos explícitamente las propiedades esperadas
        // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes
        const {
            inventoryName
        } = inventoryNameData;

        // Definimos la consulta SQL parametrizada
        // Usar placeholders ($1, $2, ...) previene inyecciones SQL
        // RETURNING permite obtener datos generados por la base de datos (inventory_name_id)
        const query = `
      INSERT INTO inventory_names (
        inventory_name
      )
      VALUES ($1)
      RETURNING inventory_name_id;
    `;


        // Array de valores que se pasan al query
        // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
        const values = [
            inventoryName
        ];


        // Ejecutamos la consulta usando el pool
        // pool.query retorna un objeto con metadata y filas resultantes
        const result = await pool.query(query, values);


        // Devolvemos únicamente el primer registro retornado
        // En este caso contiene el inventory_name_id del usuario recién creado
        return result.rows[0];
    },

    async findAll() {
        const result = await pool.query("SELECT * FROM inventory_names");
        return result.rows;
    },

    async findById(inventory_name_id) {
        const result = await pool.query("SELECT * FROM inventory_names WHERE inventory_name_id = $1", [inventory_name_id]);
        return result.rows[0]; // debe incluir user_photo
    },

    async update(inventory_name_id, inventoryNameData) {
        const { inventoryName } = inventoryNameData;

        const query = `
            UPDATE inventory_names
            SET inventory_name = $1
            WHERE inventory_name_id = $2
            RETURNING *;
        `;

        const values = [inventoryName, inventory_name_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async updateStatus(inventory_name_id, status) {
        const query = `
            UPDATE inventory_names
            SET status = $1
            WHERE inventory_name_id = $2
            RETURNING *;
        `;
        const values = [status, inventory_name_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

};
