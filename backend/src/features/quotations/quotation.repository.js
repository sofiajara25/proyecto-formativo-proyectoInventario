// Repository de cotizaciones: encapsula las consultas SQL sobre la tabla
// "quotations". Es un catálogo simple (crear + listar + ver), sin
// actualizar: si se subió mal el PDF, se crea una cotización nueva.
import { pool } from "../../config/db.js";

export const quotationRepository = {
    async create({ quotationName, pdfUrl }) {
        const query = `
            INSERT INTO quotations (quotation_name, pdf_url)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const result = await pool.query(query, [quotationName, pdfUrl]);
        return result.rows[0];
    },

    async findAll() {
        const result = await pool.query(
            "SELECT * FROM quotations ORDER BY quotation_id DESC"
        );
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query(
            "SELECT * FROM quotations WHERE quotation_id = $1",
            [id]
        );
        return result.rows[0];
    },

    async updateStatus(id, status) {
        const query = `
            UPDATE quotations
            SET status = $1
            WHERE quotation_id = $2
            RETURNING *;
        `;
        const result = await pool.query(query, [status, id]);
        return result.rows[0];
    },

    // Trae varias cotizaciones a la vez a partir de un arreglo de ids.
    // Se usa al mostrar el detalle de un material (para pintar las 1-3
    // cotizaciones que tiene enlazadas).
    async findByIds(ids) {
        if (!Array.isArray(ids) || ids.length === 0) return [];
        const result = await pool.query(
            "SELECT * FROM quotations WHERE quotation_id = ANY($1::int[])",
            [ids]
        );
        return result.rows;
    },
};
