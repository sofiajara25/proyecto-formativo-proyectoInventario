import { groupsService } from "./groups.service.js";

export const groupsController = {
    async create(req, res) {
        try {
            const group = await groupsService.create(req.body);

            res.status(201).json({
                message: "Grupo creado correctamente",
                group,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: error.message || "Error creando grupo",
            });
        }
    },

    async getAll (req, res) {
        try {
            const groups = await groupsService.getAll();

            res.json(groups);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Error obteniendo grupos",
            });
        }
    },

    async getPermissionsByGroupId(req, res) {
        try {
            const groupId = Number(req.params.groupId);

            const permissions = await groupsService.getPermissionsByGroupId(groupId);

            res.json(permissions);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Error obteniendo permisos del grupo",
            });
        }
    },
};
