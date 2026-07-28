// backend/src/features/auth/auth.repository.js

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
    },

    // Busca un usuario por su email y devuelve solo el id
    // Se usa en "olvidé mi contraseña" para saber si el correo existe
    // sin traer datos sensibles innecesarios
    async findIdByEmail(userEmail) {
        const query = `
            SELECT id
            FROM users
            WHERE user_email = $1
            LIMIT 1;
        `;

        const result = await pool.query(query, [userEmail]);

        return result.rows[0];
    },

    // Guarda el hash del código de recuperación (paso 1) o del resetToken
    // (paso 2) y su fecha de expiración para el usuario indicado.
    // Reinicia el contador de intentos.
    async saveResetToken(userId, hashedValue, expiresAt) {
        const query = `
            UPDATE users
            SET reset_token = $1,
                reset_token_expires = $2,
                reset_token_attempts = 0
            WHERE id = $3;
        `;

        await pool.query(query, [hashedValue, expiresAt, userId]);
    },

    // Busca un usuario a partir del código/token hasheado guardado en
    // reset_token. Se usa tanto para verificar el código (paso 2) como
    // para validar el resetToken antes de cambiar la contraseña (paso 3).
    // Solo devuelve el usuario si el token no ha expirado.
    async findByResetToken(hashedValue) {
        const query = `
            SELECT id, user_email, reset_token_expires
            FROM users
            WHERE reset_token = $1
              AND reset_token_expires > NOW()
            LIMIT 1;
        `;

        const result = await pool.query(query, [hashedValue]);

        return result.rows[0];
    },

    // Busca la información de recuperación (código hasheado, expiración e
    // intentos) de un usuario a partir de su correo
    async findResetInfoByEmail(userEmail) {
        const query = `
            SELECT id, user_email, reset_token, reset_token_expires, reset_token_attempts
            FROM users
            WHERE user_email = $1
            LIMIT 1;
        `;

        const result = await pool.query(query, [userEmail]);

        return result.rows[0];
    },

    // Incrementa en 1 el contador de intentos fallidos al verificar el código
    async incrementResetAttempts(userId) {
        const query = `
            UPDATE users
            SET reset_token_attempts = reset_token_attempts + 1
            WHERE id = $1;
        `;

        await pool.query(query, [userId]);
    },

    // Actualiza la contraseña del usuario y limpia el código de recuperación
    // (para que no pueda volver a usarse)
    async updatePassword(userId, hashedPassword) {
        const query = `
            UPDATE users
            SET password = $1,
                reset_token = NULL,
                reset_token_expires = NULL,
                reset_token_attempts = 0
            WHERE id = $2;
        `;

        await pool.query(query, [hashedPassword, userId]);
    },
};