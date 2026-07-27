// backend/src/features/auth.service.js
// Logica de autenticacion + JWT

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { authRepository } from "./auth.repository.js";
import { resend, MAIL_FROM } from "../../config/mailer.js";

// Tiempo de validez del código de recuperación enviado por correo (15 minutos)
const RESET_CODE_TTL_MS = 15 * 60 * 1000;

// Tiempo de validez del token temporal que autoriza cambiar la contraseña
// una vez que el código ya fue verificado correctamente
const RESET_SESSION_TTL = "10m";

// Máximo de intentos incorrectos permitidos para un mismo código
// antes de exigir que se solicite uno nuevo
const MAX_CODE_ATTEMPTS = 5;

// Genera un código numérico de 6 dígitos (con ceros a la izquierda si aplica)
function generateResetCode() {
    return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export const authService = {
    async login({ user_email, password }) {
        const user = await authRepository.findByEmail(user_email);

        console.log("USER ENCONTRADO: ", user);

        if (!user) {
            throw new Error("Credenciales invalidas");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // const isMatch = password === user.password;

        if (!isMatch) {
            throw new Error("Credenciales invalidas");
        }

        if (user.user_status !== "Activo") {
            throw new Error("Usuario inactivo");
        }

        const token = jwt.sign(
            { id: user.id, email: user.user_email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES },
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.user_email
            },
        };
    },

    // Genera un código de 6 dígitos, guarda solo su hash y lo envía por correo.
    // Nota: siempre debe comportarse igual (sin lanzar error) exista o no el
    // email, para no revelar si un correo está registrado o no
    async forgotPassword(userEmail) {
        const user = await authRepository.findIdByEmail(userEmail);

        if (!user) {
            // No revelamos si el email existe o no
            return;
        }

        // Código que se envía al usuario por correo
        const code = generateResetCode();

        // Solo guardamos el hash del código en la base de datos.
        // Así, si alguien accede a la BD, no puede usar el código directamente
        const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

        const expiresAt = new Date(Date.now() + RESET_CODE_TTL_MS);

        await authRepository.saveResetCode(user.id, hashedCode, expiresAt);

        await resend.emails.send({
            from: MAIL_FROM,
            to: userEmail,
            subject: "Código para recuperar tu contraseña",
            html: `
                <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                <p>Tu código de verificación es:</p>
                <p style="font-size:28px; font-weight:bold; letter-spacing:6px;">${code}</p>
                <p>Este código expira en 15 minutos.</p>
                <p>Si tú no solicitaste esto, puedes ignorar este correo.</p>
            `,
        });
    },

    // Valida el código enviado por correo. Si es correcto, emite un token
    // temporal (JWT) de corta duración que autoriza el cambio de contraseña,
    // sin exponer el id del usuario ni permitir reutilizar el código.
    async verifyResetCode({ user_email, code }) {
        if (!user_email || !code) {
            throw new Error("Faltan datos");
        }

        const user = await authRepository.findResetInfoByEmail(user_email);

        if (!user || !user.reset_token || !user.reset_token_expires) {
            throw new Error("El código es inválido o ya expiró");
        }

        if (new Date(user.reset_token_expires) < new Date()) {
            throw new Error("El código expiró, solicita uno nuevo");
        }

        if (user.reset_token_attempts >= MAX_CODE_ATTEMPTS) {
            throw new Error("Superaste el número de intentos permitidos, solicita un nuevo código");
        }

        const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

        if (hashedCode !== user.reset_token) {
            await authRepository.incrementResetAttempts(user.id);
            throw new Error("El código ingresado es incorrecto");
        }

        const resetToken = jwt.sign(
            { id: user.id, purpose: "password_reset" },
            process.env.JWT_SECRET,
            { expiresIn: RESET_SESSION_TTL },
        );

        return { resetToken };
    },

    // Valida el token temporal emitido tras verificar el código y actualiza
    // la contraseña del usuario
    async resetPassword({ resetToken, newPassword }) {
        if (!resetToken || !newPassword) {
            throw new Error("Faltan datos");
        }

        if (newPassword.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres");
        }

        let payload;

        try {
            payload = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch (err) {
            throw new Error("La sesión para cambiar la contraseña expiró, solicita un nuevo código");
        }

        if (payload.purpose !== "password_reset") {
            throw new Error("Token inválido");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await authRepository.updatePassword(payload.id, hashedPassword);
    },
};