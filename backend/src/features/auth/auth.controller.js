// backend/src/features/auth/auth.controller.js
// endpoint login

import { authService } from "./auth.service.js";

export const authController = {
    async login(req, res) {
        try {
            const result = await authService.login(req.body);

            res.status(200).json({
                message: "Login exitoso",
                ...result,
            });
        } catch (err) {
            // Sesión activa en otro lado: se distingue con su propio código
            // para que el frontend pueda ofrecer el botón de "forzar cierre"
            // en vez de mostrarlo como un error de credenciales cualquiera.
            if (err.code === "ACTIVE_SESSION") {
                return res.status(409).json({
                    error: err.message,
                    code: "ACTIVE_SESSION",
                });
            }

            res.status(401).json({
                error: err.message,
            });
        }
        console.log("BODY LOGIN:", req.body);
    },

    // POST /api/auth/logout
    // Limpia la sesión activa del usuario logueado (req.user viene del
    // middleware authenticateToken), para que pueda volver a iniciar
    // sesión en otra pestaña/navegador sin tener que forzarlo.
    async logout(req, res) {
        try {
            await authService.logout(req.user.id);
            res.status(200).json({ message: "Sesión cerrada correctamente" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // GET /api/auth/session
    // Si llegó hasta acá es porque authenticateToken ya confirmó que la
    // sesión sigue siendo válida (si no, ya habría respondido 401 antes).
    async checkSession(req, res) {
        res.status(200).json({ ok: true });
    },

    // POST /api/auth/forgot-password
    // Recibe el correo y envía (si existe) un código de 6 dígitos
    async forgotPassword(req, res) {
        try {
            const { user_email } = req.body;

            if (!user_email) {
                return res.status(400).json({ error: "El correo es obligatorio" });
            }

            await authService.forgotPassword(user_email);

            // Respuesta genérica siempre (exista o no el email)
            res.status(200).json({
                message: "Si el correo existe, se envió un código de verificación",
            });
        } catch (err) {
            console.error("Error en forgotPassword:", err);
            res.status(500).json({
                error: "No se pudo procesar la solicitud",
            });
        }
    },

    // POST /api/auth/verify-code
    // Recibe el correo y el código de 6 dígitos, y si es válido devuelve
    // un token temporal que autoriza cambiar la contraseña
    async verifyCode(req, res) {
        try {
            const { user_email, code } = req.body;

            const result = await authService.verifyResetCode({ user_email, code });

            res.status(200).json({
                message: "Código verificado correctamente",
                resetToken: result.resetToken,
            });
        } catch (err) {
            res.status(400).json({
                error: err.message,
            });
        }
    },

    // POST /api/auth/reset-password
    // Recibe el token temporal (obtenido tras verificar el código) y la nueva contraseña
    async resetPassword(req, res) {
        try {
            const { resetToken, newPassword } = req.body;

            await authService.resetPassword({ resetToken, newPassword });

            res.status(200).json({
                message: "Contraseña actualizada correctamente",
            });
        } catch (err) {
            res.status(400).json({
                error: err.message,
            });
        }
    },
}