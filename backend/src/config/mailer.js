// Cliente de correo usado para el envío de emails transaccionales
// (por ahora: recuperación de contraseña)
//
// Usamos Gmail + Nodemailer porque no requiere verificar un dominio propio:
// con una cuenta de Gmail y una "contraseña de aplicación" puedes enviar
// correos a CUALQUIER destinatario real, totalmente gratis.

import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Cargamos las variables definidas en el archivo .env
dotenv.config();

// Validamos al iniciar que las variables necesarias existan.
// Falla rápido y con un mensaje claro, en vez de fallar silenciosamente
// la primera vez que alguien pida recuperar su contraseña.
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn(
        "⚠️  Faltan GMAIL_USER y/o GMAIL_APP_PASSWORD en el .env. " +
        "El envío de correos (recuperar contraseña) no funcionará hasta que las configures."
    );
}

// Creamos y exportamos un transporter único de Nodemailer, configurado
// para usar el servicio SMTP de Gmail
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        // Tu correo de Gmail (el que generó la contraseña de aplicación)
        user: process.env.GMAIL_USER,
        // La contraseña de aplicación de 16 caracteres (NO tu contraseña normal de Gmail)
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

// Remitente que verán los usuarios en el correo recibido
export const MAIL_FROM = process.env.MAIL_FROM || process.env.GMAIL_USER;