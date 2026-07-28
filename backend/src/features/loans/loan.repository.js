// Importamos el pool de conexión a PostgreSQL.
// Este pool es una instancia compartida configurada en la capa de infraestructura.
import { pool } from "../../config/db.js";


// Exportamos el repositorio de préstamos.
// El repository encapsula todas las consultas SQL relacionadas con loans.
export const loanRepository = {


    // Método encargado de crear un préstamo en la base de datos
    // Recibe un objeto con los datos ya validados y procesados por el service
    async create(loanData) {


        // Desestructuramos explícitamente las propiedades esperadas
        // Esto hace el contrato de datos claro y evita acceder a propiedades inexistentes
        const {
            loanUser,
            loanCategory,
            loanProductName,
            loanDate,
            loanReturnDate,
            loanDescription,
            loanQuantity,
            photo
        } = loanData;

        // Definimos la consulta SQL parametrizada
        // Usar placeholders ($1, $2, ...) previene inyecciones SQL
        // RETURNING permite obtener datos generados por la base de datos (loan_id)
        const query = `
      INSERT INTO loans (
        loan_user,
        category,
        product_name,
        loan_date,
        return_date,
        description,
        quantity,
        photo_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;


        // Array de valores que se pasan al query
        // El orden debe coincidir EXACTAMENTE con los placeholders del SQL
        const values = [
            loanUser,
            loanCategory,
            loanProductName,
            loanDate,
            loanReturnDate,
            loanDescription,
            loanQuantity,
            photo,
        ];


        // Ejecutamos la consulta usando el pool
        // pool.query retorna un objeto con metadata y filas resultantes
        const result = await pool.query(query, values);


        // Devolvemos el registro completo recién creado (incluye loan_id y status por defecto)
        return result.rows[0];
    },

    // Trae todos los préstamos, más recientes primero.
    // Usado por GET /api/loan
    async findAll() {
        const query = `SELECT * FROM loans ORDER BY loan_id DESC;`;
        const result = await pool.query(query);
        return result.rows;
    },

    // Trae un préstamo por loan_id. Devuelve null si no existe.
    // Usado por GET /api/loan/:loan_id
    async findById(loan_id) {
        const query = `SELECT * FROM loans WHERE loan_id = $1;`;
        const result = await pool.query(query, [loan_id]);
        return result.rows[0] || null;
    },

    // Actualiza los campos editables de un préstamo.
    // Solo actualiza photo_url si se envía una foto nueva (COALESCE conserva la anterior).
    // Usado por PUT /api/loan/:loan_id
    async update(loan_id, loanData) {
        const {
            loanUser,
            loanCategory,
            loanProductName,
            loanDate,
            loanReturnDate,
            loanDescription,
            loanQuantity,
            photo,
        } = loanData;

        const query = `
      UPDATE loans
      SET
        loan_user = $1,
        category = $2,
        product_name = $3,
        loan_date = $4,
        return_date = $5,
        description = $6,
        quantity = $7,
        photo_url = COALESCE($8, photo_url)
      WHERE loan_id = $9
      RETURNING *;
    `;

        const values = [
            loanUser,
            loanCategory,
            loanProductName,
            loanDate,
            loanReturnDate,
            loanDescription,
            loanQuantity,
            photo ?? null,
            loan_id,
        ];

        const result = await pool.query(query, values);
        return result.rows[0] || null;
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