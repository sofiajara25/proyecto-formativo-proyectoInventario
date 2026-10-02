// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.
import { pool } from "../../config/db.js";


// Exportamos el repositorio de usuarios.
// El repository encapsula todas las consultas SQL relacionadas con users.
export const categoryRepository = {


    // Método encargado de crear un usuario en la base de datos
    // Recibe un objeto con los datos ya validados y procesados por el service
    async create(categoryData) {


        // Desestructuramos explícitamente las propiedades esperadas
        // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes
        // La categoría solo tiene nombre (ya no depende de un "tipo de
        // elemento", ver migración 085). El estado arranca en "Activo" por
        // el DEFAULT de la columna.
        const {
            categoryName,
        } = categoryData;

        // Definimos la consulta SQL parametrizada
        // Usar placeholders ($1, $2, ...) previene inyecciones SQL
        // RETURNING permite obtener datos generados por la base de datos (category_id)
        const query = `
      INSERT INTO categorys (
        category_name
      )
      VALUES ($1)
      RETURNING category_id, category_name;
    `;


        // Array de valores que se pasan al query
        // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
        const values = [
            categoryName,
        ];


        // Ejecutamos la consulta usando el pool
        // pool.query retorna un objeto con metadata y filas resultantes
        const result = await pool.query(query, values);


        // Devolvemos únicamente el primer registro retornado
        // En este caso contiene el category_id del usuario recién creado
        return result.rows[0];
    },

    async findAll() {
        // Primero las 3 por defecto, luego las demás por nombre.
        const result = await pool.query("SELECT * FROM categorys ORDER BY is_default DESC, category_name");
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query("SELECT * FROM categorys WHERE category_id = $1", [id]);
        return result.rows[0]; // debe incluir user_photo
    },

    async update(id, categoryData) {
        const {
            categoryName,
        } = categoryData;

        const query = `
            UPDATE categorys
            SET category_name = $1
            WHERE category_id = $2
            RETURNING *;
        `;

        const values = [
            categoryName,
            id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async updateStatus(id, status) {
        const query = `
            UPDATE categorys
            SET status = $1
            WHERE category_id = $2
            RETURNING *;
        `;
        const values = [status, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

};
