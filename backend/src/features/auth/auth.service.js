// backend/src/features/auth.service.js
// Logica de autenticacion + JWT

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { authRepository } from "./auth.repository.js";
import { transporter, MAIL_FROM } from "../../config/mailer.js";

// Tiempo de validez del código de 6 dígitos que se envía por correo
const RESET_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutos

// Tiempo de validez del resetToken que se entrega tras verificar el código
// (con ese token el usuario ya puede definir la nueva contraseña)
const RESET_SESSION_TTL_MS = 15 * 60 * 1000; // 15 minutos

// Genera un código numérico de 6 dígitos (ej: "042817")
function generateSixDigitCode() {
    return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function hashValue(value) {
    return crypto.createHash("sha256").update(value).digest("hex");
}

export const authService = {
    async login({ user_email, password }) {
        const user = await authRepository.findByEmail(user_email);

        console.log("USER ENCONTRADO: ", user);

        if (!user) {
            throw new Error("Credenciales invalidas");
        }

        const isMatch = await bcrypt.compare(password, user.password);

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

    // Paso 1: genera un código de 6 dígitos, lo guarda (hasheado) y lo envía por correo.
    // Nota: siempre debe comportarse igual (sin lanzar error) exista o no el
    // email, para no revelar si un correo está registrado o no
    async forgotPassword(userEmail) {
        const user = await authRepository.findIdByEmail(userEmail);

        if (!user) {
            // No revelamos si el email existe o no
            return;
        }

        const code = generateSixDigitCode();
        const hashedCode = hashValue(code);
        const expiresAt = new Date(Date.now() + RESET_CODE_TTL_MS);

        await authRepository.saveResetToken(user.id, hashedCode, expiresAt);

        await transporter.sendMail({
            from: MAIL_FROM,
            to: userEmail,
            subject: "Código para recuperar tu contraseña",
            html: `
                <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                <p>Tu código de verificación es:</p>
                <h2 style="letter-spacing:4px;">${code}</h2>
                <p>Este código expira en 10 minutos. Si tú no solicitaste esto, puedes ignorar este correo.</p>
            `,
        });
    },

    // Paso 2: valida el código de 6 dígitos contra el correo indicado.
    // Si es correcto, genera un resetToken de un solo uso (válido 15 min)
    // que autoriza el paso 3 (definir la nueva contraseña).
    async verifyResetCode({ user_email, code }) {
        if (!user_email || !code) {
            throw new Error("Faltan datos");
        }

        const hashedCode = hashValue(code);
        const user = await authRepository.findByResetToken(hashedCode);

        // Validamos también que el código pertenezca al correo indicado
        if (!user || user.user_email !== user_email) {
            throw new Error("El código es inválido o ya expiró");
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedResetToken = hashValue(resetToken);
        const expiresAt = new Date(Date.now() + RESET_SESSION_TTL_MS);

        // Sobreescribimos el código por el resetToken: así el código de 6 dígitos
        // queda invalidado y no se puede volver a usar una vez verificado.
        await authRepository.saveResetToken(user.id, hashedResetToken, expiresAt);

        return { resetToken };
    },

    // Paso 3: valida el resetToken recibido tras verificar el código
    // y actualiza la contraseña del usuario
    async resetPassword({ resetToken, newPassword }) {
        if (!resetToken || !newPassword) {
            throw new Error("Faltan datos");
        }

        if (newPassword.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres");
        }

        const hashedToken = hashValue(resetToken);

        const user = await authRepository.findByResetToken(hashedToken);

        if (!user) {
            throw new Error("El enlace es inválido o ya expiró");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await authRepository.updatePassword(user.id, hashedPassword);
    },
};