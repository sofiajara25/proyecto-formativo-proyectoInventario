// backend/scr/features/access/access.repository.js

import { pool } from "../../config/db.js";

export const accessRepository = {
    async isSuperUser(userId) {
        const query = `
        SELECT user_status
        FROM users
        WHERE id = $1;
        `;

        const result = await pool.query(query, [userId]);

        return result.rows[0]?.user_status ?? false;
    },

    async getUserPermissions(userId) {
        const query = `
            SELECT DISTINCT p.permission_codename

            FROM permissions p

            INNER JOIN user_permissions up
                ON up.permission_id  = p.permission_id

            WHERE up.user.id = $1

            UNION

            SELECT DISTINCT  p.permission_codename
            
            FROM permissions p 

            INNER JOIN group_permissions gp
                ON gp.permission_id = p.permission_id

            INNER JOIN user_groups ug
                ON ug.group_id = gp.group_id

            WHERE ug.user_id = $1;
        `;

        const result = await pool.query(query, [userId]);

        return result.rows.map((row) => row.permission_codename);
    },
};