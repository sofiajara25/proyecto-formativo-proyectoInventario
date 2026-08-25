import { pool } from "../../config/db.js";

export const loanSignatureRepository = {
    async create({ loanId, signerEmail, token }) {
        const query = `
            INSERT INTO loan_signatures (loan_id, signer_email, token)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await pool.query(query, [loanId, signerEmail, token]);
        return result.rows[0];
    },

    // Trae la firma junto con el resumen del préstamo (usuario, fechas y
    // materiales) para mostrarlo en la página pública de aceptación.
    async findByToken(token) {
        const result = await pool.query(`
            SELECT
                ls.id,
                ls.token,
                ls.signer_email,
                ls.status,
                ls.accepted_at,
                l.loan_id,
                l.loan_user,
                l.loan_date,
                l.return_date,
                l.description,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'product_name', li.product_name,
                            'quantity', li.quantity
                        )
                    ) FILTER (WHERE li.id IS NOT NULL),
                    '[]'
                ) AS materials
            FROM loan_signatures ls
            JOIN loans l ON l.loan_id = ls.loan_id
            LEFT JOIN loan_items li ON li.loan_id = l.loan_id
            WHERE ls.token = $1
            GROUP BY ls.id, l.loan_id;
        `, [token]);

        return result.rows[0];
    },

    async acceptByToken(token) {
        const result = await pool.query(`
            UPDATE loan_signatures
            SET status = 'Aceptado', accepted_at = NOW()
            WHERE token = $1 AND status = 'Pendiente'
            RETURNING *;
        `, [token]);
        return result.rows[0];
    },
};
