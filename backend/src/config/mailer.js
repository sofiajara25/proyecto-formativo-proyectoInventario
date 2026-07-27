// Cliente de Resend usado para el envío de correos transaccionales
// (por ahora: recuperación de contraseña)

import { Resend } from "resend";
import dotenv from "dotenv";

// Cargamos las variables definidas en el archivo .env
dotenv.config();

// Creamos y exportamos una instancia única de Resend
// Esta instancia se reutiliza en toda la aplicación
export const resend = new Resend(process.env.RESEND_API_KEY);

// Remitente de los correos.
// En desarrollo (sin dominio verificado en Resend) se debe usar "onboarding@resend.dev",
// que solo permite enviar al correo con el que te registraste en Resend.
// En producción, cambia esto por un correo de tu propio dominio verificado, ej:
// "no-reply@tudominio.com"
export const MAIL_FROM = process.env.MAIL_FROM || "onboarding@resend.dev";