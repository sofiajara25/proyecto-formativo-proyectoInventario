// backend/src/features/auth/auth.repository.js

import { pool } from "../../config/db.js";

// Si la sesión activa lleva este tiempo sin "señal de vida" (la pestaña la
// envía cada 5 segundos), se considera abandonada: pestaña o navegador
// cerrado, equipo apagado o sin conexión. Se deja un margen amplio porque
// los navegadores frenan los temporizadores de las pestañas en segundo
// plano (hasta una consulta por minuto).
export const SESSION_STALE_MINUTES = 3;

// Repositorio encargado de consultar la informacion de autenticacion del usuario
export const authRepository = {
    // Busca un usuario para correr electronico y devuelve solo los campos necesarios para validar el inicio de sesion 
    async findByEmail(userEmail) {
        // is_locked y lock_minutes_left se calculan en la base de datos
        // (con NOW() del mismo servidor), para no depender de la zona
        // horaria del backend al comparar con locked_until.
        const query = `
            SELECT id, user_email, password, user_status, active_token,
                   failed_login_attempts,
                   (locked_until IS NOT NULL AND locked_until > NOW()) AS is_locked,
                   CEIL(EXTRACT(EPOCH FROM (locked_until - NOW())) / 60)::int AS lock_minutes_left,
                   (last_seen_at IS NOT NULL
                       AND last_seen_at > NOW() - make_interval(mins => $2)) AS session_alive
            FROM users
            WHERE user_email = $1
            LIMIT 1;
        `;

        const result = await pool.query(query, [userEmail, SESSION_STALE_MINUTES]);

        return result.rows[0];
    },

    // Suma un intento fallido de inicio de sesión. Al llegar a maxAttempts
    // bloquea la cuenta lockMinutes minutos y reinicia el contador (todo en
    // una sola consulta, para que dos intentos simultáneos no se pisen).
    async registerFailedLogin(userId, maxAttempts, lockMinutes) {
        const query = `
            UPDATE users
            SET failed_login_attempts = CASE
                    WHEN failed_login_attempts + 1 >= $2 THEN 0
                    ELSE failed_login_attempts + 1
                END,
                locked_until = CASE
                    WHEN failed_login_attempts + 1 >= $2 THEN NOW() + make_interval(mins => $3)
                    ELSE locked_until
                END
            WHERE id = $1
            RETURNING failed_login_attempts,
                      (locked_until IS NOT NULL AND locked_until > NOW()) AS is_locked;
        `;

        const result = await pool.query(query, [userId, maxAttempts, lockMinutes]);
        return result.rows[0];
    },

    // Al iniciar sesión correctamente, los intentos fallidos vuelven a 0.
    async resetLoginAttempts(userId) {
        await pool.query(
            "UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1",
            [userId]
        );
    },

    // Guarda el token recién emitido como "el activo" para ese usuario.
    // Mientras este token siga siendo válido, no se deja iniciar sesión
    // de nuevo en otra pestaña/navegador (a menos que se fuerce).
    async setActiveToken(userId, token) {
        const query = `
            UPDATE users
            SET active_token = $1,
                last_seen_at = NOW()
            WHERE id = $2;
        `;

        await pool.query(query, [token, userId]);
    },

    // "Señal de vida" de la sesión: la pestaña abierta consulta
    // /api/auth/session cada pocos segundos y cada consulta pasa por aquí.
    async touchLastSeen(userId) {
        await pool.query("UPDATE users SET last_seen_at = NOW() WHERE id = $1", [userId]);
    },

    // Limpia la sesión activa (logout normal, o cuando se fuerza el cierre
    // de la sesión anterior desde el login).
    async clearActiveToken(userId) {
        const query = `
            UPDATE users
            SET active_token = NULL
            WHERE id = $1;
        `;

        await pool.query(query, [userId]);
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
    // (para que no pueda volver a usarse). Recuperar la contraseña también
    // desbloquea la cuenta si estaba bloqueada por intentos fallidos.
    async updatePassword(userId, hashedPassword) {
        const query = `
            UPDATE users
            SET password = $1,
                reset_token = NULL,
                reset_token_expires = NULL,
                reset_token_attempts = 0,
                failed_login_attempts = 0,
                locked_until = NULL
            WHERE id = $2;
        `;

        await pool.query(query, [hashedPassword, userId]);
    },
};