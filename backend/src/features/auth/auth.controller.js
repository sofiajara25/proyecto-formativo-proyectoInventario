// backend/src/features/auth/auth.controller.js
// endpoint login

import { authService } from "./auth.service.js";

export const authController = {
    async login (req, res) {
        try {
            const result = await authService.login(req.body);

            res.status(200).json({
                message: "Login exitoso",
                ...result,
            });
        } catch (err) {
            res.status(401).json({
                error: err.message,
            });
        }
        console.log("BODY LOGIN:", req.body);
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