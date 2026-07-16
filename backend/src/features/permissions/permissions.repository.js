import { pool } from "../../config/db.js";

export const permissionsRepository = {
    async getAll() {
        const query = `
        SELECT
        permission_id,
        permission_name,
        permission_codename
        FROM permissions
        ORDER BY permission_name
        `;

        const result = await pool.query(query);

        return result.rows;
    },
};