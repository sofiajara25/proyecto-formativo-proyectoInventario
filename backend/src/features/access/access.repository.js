// backend/scr/features/access/access.repository.js

import { pool } from "../../config/db.js";

export const accessRepository = {
    // Nombre del grupo del usuario (ej. "Administrador"). Ya NO se usa
    // para saltarse permisos: es solo una etiqueta, útil para decidir
    // qué mostrar en la interfaz (ver Navbar.jsx / ProfilePage.jsx).
    // La columna users.user_type fue eliminada (migración 040); el
    // grupo del usuario ahora vive en users.group_id (migración 041).
    // El "Super Administrador" es una bandera aparte (users.is_super_admin),
    // no un grupo ni un permiso: es la única persona que puede entrar a
    // Grupos y Permisos y decidir quién tiene qué. No da acceso a nada más
    // por sí sola.
    async isSuperAdmin(userId) {
        const query = `
            SELECT is_super_admin
            FROM users
            WHERE id = $1
            LIMIT 1;
        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0]?.is_super_admin === true;
    },

    async getUserType(userId) {
        const query = `
            SELECT g.group_name AS user_type
            FROM users u
            LEFT JOIN groups g ON g.group_id = u.group_id
            WHERE u.id = $1
            LIMIT 1;
        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0]?.user_type ?? null;
    },

    // Permisos reales del usuario: los asignados directamente a él,
    // unidos con los que hereda de su grupo (users.group_id). No hay
    // atajos ni bypass: todo sale de aquí, incluso para el grupo
    // "Administrador".
    async getUserPermissions(userId) {
        const query = `
            SELECT DISTINCT p.permission_codename

            FROM permissions p

            INNER JOIN user_permissions up
                ON up.permission_id  = p.permission_id

            WHERE up.user_id = $1

            UNION

            SELECT DISTINCT p.permission_codename

            FROM permissions p

            INNER JOIN group_permissions gp
                ON gp.permission_id = p.permission_id

            INNER JOIN users u
                ON u.group_id = gp.group_id

            WHERE u.id = $1;
        `;

        const result = await pool.query(query, [userId]);

        return result.rows.map((row) => row.permission_codename);
    },
};