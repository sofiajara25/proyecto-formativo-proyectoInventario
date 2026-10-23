import nodemailer from "nodemailer";
import os from "os";

// El transporter se conecta a Gmail usando una "contraseña de aplicación",
// NO la contraseña normal de la cuenta.
// Guía: https://myaccount.google.com/apppasswords
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,       // ej: tuapp@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD, // la contraseña de aplicación de 16 caracteres
    },
});

/**
 * Envía el correo de recuperación de contraseña con un código de verificación.
 * @param {string} to - correo del usuario
 * @param {string} code - código numérico (ej: "482913")
 */
export async function sendPasswordResetEmail(to, code) {
    const mailOptions = {
        from: `"Soporte" <${process.env.GMAIL_USER}>`,
        to,
        subject: "Código de recuperación de contraseña",
        html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Recuperación de contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Usa el siguiente código para continuar. Expira en 15 minutos.</p>
        <p style="text-align: center; margin: 24px 0;">
          <span style="display:inline-block; background:#2563eb; color:white; padding:14px 28px; border-radius:8px; font-size:28px; letter-spacing:6px; font-weight:bold;">
            ${code}
          </span>
        </p>
        <p>Si no solicitaste esto, puedes ignorar este correo.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
}
// URL base del frontend para armar el enlace de aceptación.
// Si FRONTEND_URL apunta a una dirección real (ej. un dominio o una IP),
// se usa tal cual. Si apunta a "localhost" (o no está), se cambia por la
// IP de este computador en la red Wi-Fi: "localhost" en un celular es el
// mismo celular, así que el enlace del correo no abriría nada. Con la IP,
// cualquier celular conectado a la misma red puede aceptar el préstamo.
// Se calcula en cada correo porque la IP cambia según la red (casa, SENA).
const FRONTEND_PORT = 5173;

function getLanIp() {
    const ignored = /vethernet|virtualbox|vmware|wsl|hyper-v|docker|loopback/i;
    for (const [name, addresses] of Object.entries(os.networkInterfaces())) {
        if (ignored.test(name)) continue;
        const ipv4 = (addresses || []).find((a) => a.family === "IPv4" && !a.internal);
        if (ipv4) return ipv4.address;
    }
    return null;
}

function getFrontendUrl() {
    const configured = process.env.FRONTEND_URL;
    if (configured && !/localhost|127\.0\.0\.1/.test(configured)) {
        return configured.replace(/\/+$/, "");
    }
    const ip = getLanIp();
    return ip ? `http://${ip}:${FRONTEND_PORT}` : `http://localhost:${FRONTEND_PORT}`;
}

/**
 * Envía el correo con el enlace público para aceptar (firmar) un préstamo.
 * No requiere que el destinatario tenga cuenta en el sistema: el enlace
 * funciona solo con el token, sin necesidad de iniciar sesión.
 * @param {string} to - correo del receptor del préstamo
 * @param {string} token - token único del registro en loan_signatures
 * @param {{ loanUser: string, materialsSummary: string, loanDate: string, returnDate: string }} loan
 */
export async function sendLoanAcceptanceEmail(to, token, loan) {
    const acceptUrl = `${getFrontendUrl()}/aceptar-prestamo/${token}`;

    const mailOptions = {
        from: `"Soporte" <${process.env.GMAIL_USER}>`,
        to,
        subject: "Confirmación de préstamo",
        html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Confirmación de préstamo</h2>
        <p>Se registró un préstamo a tu nombre (${loan.loanUser}):</p>
        <p><strong>Material:</strong> ${loan.materialsSummary}</p>
        <p><strong>Fecha de préstamo:</strong> ${loan.loanDate}</p>
        <p><strong>Fecha de devolución:</strong> ${loan.returnDate}</p>
        <p>Por favor confirma que aceptas este préstamo:</p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="${acceptUrl}" style="display:inline-block; background:#2563eb; color:white; padding:14px 28px; border-radius:8px; font-size:16px; font-weight:bold; text-decoration:none;">
            Acepto este préstamo
          </a>
        </p>
        <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="word-break: break-all;">${acceptUrl}</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
}

// 👇 exportamos ambas cosas
export const MAIL_FROM = process.env.MAIL_FROM || process.env.GMAIL_USER;
export default transporter;


