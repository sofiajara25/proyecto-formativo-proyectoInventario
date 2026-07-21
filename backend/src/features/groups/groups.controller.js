import { groupsService } from "./groups.service.js";

export const groupsController = {

    // groups.controller.js
    async createGroup(req, res) {


        // Log del cuerpo de la petición
        // Útil en desarrollo para validar que el frontend envía correctamente los datos
        // En producción suele reemplazarse por logging estructurado o eliminarse
        console.log("BODY RECIBIDO:", req.body); // CLAVE


        try {
            // Llamamos al servicio de usuario, pasando los datos recibidos
            // Aquí ocurre la lógica real de negocio (validaciones, persistencia, etc.)
            const group = await groupsService.createGroup(req.body);


            // Respuesta HTTP en caso de éxito
            // 201: recurso creado correctamente según el estándar REST
            res.status(201).json({
                // Mensaje informativo para el cliente
                message: "El grupo creadao correctamente",


                // Retornamos únicamente el ID del usuario creado
                // Evita exponer información sensible innecesaria
                groupId: group.group_id,
                groupName: group.group_name,
            });


        } catch (err) {
            // Capturamos cualquier error lanzado por el service o capas inferiores
            // Se registra el error completo para depuración en backend
            console.error("ERROR BACKEND:", err);


            // Respuesta HTTP de error genérico
            // 500: error interno del servidor
            res.status(500).json({
                // Se envía el mensaje del error para diagnóstico
                // En producción suele mapearse a mensajes controlados
                error: err.message,
            });
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