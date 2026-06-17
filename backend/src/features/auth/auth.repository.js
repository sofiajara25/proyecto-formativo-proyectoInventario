// backend/scr/features/auth/auth.repository.js

import { pool } from "../../config/db.js";

// Repositorio encargado de consultar la informacion de autenticacion del usuario
export const authRepository = {
    // Busca un usuario para correr electronico y devuelve solo los campos necesarios para validar el inicio de sesion 
    async findByEmail(userEmail) {
        const query = `
            SELECT id, user_email, password, user_status
            FROM users
            WHERE user_email = $1
            LIMIT 1;
        `;

        const result = await pool.query(query, [userEmail]);

        return result.rows[0];
    }
}