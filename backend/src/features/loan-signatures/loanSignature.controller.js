import { loanSignatureService } from "./loanSignature.service.js";

// Rutas públicas (sin login): quien recibe el préstamo puede no tener
// cuenta en el sistema, así que no se puede exigir autenticación aquí.
export const loanSignatureController = {
    async getByToken(req, res) {
        try {
            const { token } = req.params;
            const signature = await loanSignatureService.getByToken(token);
            if (!signature) return res.status(404).json({ error: "Enlace inválido o expirado" });
            res.status(200).json(signature);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async accept(req, res) {
        try {
            const { token } = req.params;
            const updated = await loanSignatureService.acceptByToken(token);
            if (!updated) {
                return res.status(400).json({ error: "Este préstamo ya fue aceptado o el enlace no es válido" });
            }
            res.status(200).json({ message: "Préstamo aceptado correctamente", signature: updated });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
