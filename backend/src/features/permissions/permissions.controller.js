import { permissionsService } from "./permissions.service.js";

export const permissionsController = {
    async getAll(req, res) {
        try {
            const permissions = await permissionsService.getAll();

            res.json(permissions);
        } catch (error){
            console.error(error);

            res.status(500).json({
                error: "Error obteniendo permisos",
            });
        }
    },
};