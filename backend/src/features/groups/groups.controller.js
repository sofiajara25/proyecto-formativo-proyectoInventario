import { groupsService } from "./groups.service.js";

export const groupsController = {

    // groups.controller.js
    async createGroup(req, res) {
        try {
            const { group_name } = req.body;
            const newGroup = await groupsService.createGroup(group_name);
            res.status(201).json(newGroup);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error creando grupo" });
        }
    },

    async getAll(req, res) {
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

    async updatePermissions(req, res) {
        try {
            const groupId = Number(req.params.groupId);
            const { permissionIds } = req.body;

            await groupsService.updatePermissions(groupId, permissionIds);

            res.status(200).json({
                message: "Permisos actualizados correctamente",
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Error actualizando permisos del grupo",
            });
        }
    },
};