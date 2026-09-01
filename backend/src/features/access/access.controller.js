import { accessService } from "./access.service.js";

export const accessController = {
    async testPermission(req, res) {
        const userId = Number(req.params.userId);

        const hasPermission = await accessService.hasPermission(
            userId,
            "list_user",
        );

        res.json({
            userId,
            permission: "list_user",
            granted: hasPermission,
        });
    },

    // Devuelve el resumen de acceso del usuario logueado (a partir del
    // token, no de un :userId en la URL, para que cada quien solo pueda
    // consultar su propio acceso).
    async me(req, res) {
        try {
            const access = await accessService.getMyAccess(req.user.id);
            res.json(access);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};