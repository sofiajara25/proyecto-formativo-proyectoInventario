import crypto from "crypto";
import { loanSignatureRepository } from "./loanSignature.repository.js";
import { sendLoanAcceptanceEmail } from "../../config/mailer.js";

export const loanSignatureService = {
    // Se llama justo después de crear un préstamo. No lanza error si el
    // correo falla (ej. credenciales de Gmail mal configuradas): la firma
    // ya queda creada en la base de datos y se puede reenviar el enlace
    // manualmente si hace falta, pero el préstamo en sí no debe fallar por
    // un problema de envío de correo.
    async createForLoan({ loanId, signerEmail, loanUser, materialsSummary, loanDate, returnDate }) {
        if (!signerEmail) return null;

        const token = crypto.randomBytes(24).toString("hex");
        const signature = await loanSignatureRepository.create({ loanId, signerEmail, token });

        try {
            await sendLoanAcceptanceEmail(signerEmail, token, {
                loanUser,
                materialsSummary,
                loanDate,
                returnDate,
            });
        } catch (err) {
            console.error("Error enviando correo de firma de préstamo:", err);
        }

        return signature;
    },

    async getByToken(token) {
        return await loanSignatureRepository.findByToken(token);
    },

    async acceptByToken(token) {
        return await loanSignatureRepository.acceptByToken(token);
    },
};
