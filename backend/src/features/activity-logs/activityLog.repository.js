import { pool } from "../../config/db.js";

export const activityLogRepository = {
    // Lista los logs más recientes primero, con paginación simple.
    // Opcionalmente filtra por módulo (ej. "brands") si se pasa.
    async list({ limit, offset, module }) {
        const params = [];
        let where = "";

        if (module) {
            params.push(module);
            where = `WHERE module = $${params.length}`;
        }

        params.push(limit, offset);

        const query = `
            SELECT id, user_id, user_name, action, module, entity_id, description, created_at
            FROM activity_logs
            ${where}
            ORDER BY created_at DESC
            LIMIT $${params.length - 1} OFFSET $${params.length};
        `;

        const result = await pool.query(query, params);
        return result.rows;
    },

    async count({ module }) {
        const params = [];
        let where = "";

        if (module) {
            params.push(module);
            where = `WHERE module = $${params.length}`;
        }

        const result = await pool.query(
            `SELECT COUNT(*)::int AS total FROM activity_logs ${where};`,
            params
        );
        return result.rows[0]?.total ?? 0;
    },

    // Lista de módulos distintos que ya tienen al menos un log, para
    // llenar el filtro del frontend sin tener que hardcodearlo ahí.
    async listModules() {
        const result = await pool.query(
            "SELECT DISTINCT module FROM activity_logs ORDER BY module;"
        );
        return result.rows.map((row) => row.module);
    },
};
