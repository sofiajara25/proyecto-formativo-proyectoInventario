// Importamos el servicio de usuarios.
// El controller NO implementa lógica de negocio,
// solo delega la operación al service correspondiente.
import { returnableMaterialService } from "./returnableMaterial.service.js";


// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)
export const returnableMaterialController = {


    // Método encargado de manejar la creación de un usuario
    // Se asume que este método será usado como handler de una ruta Express
    async create(req, res) {


        // Log del cuerpo de la petición
        // Útil en desarrollo para validar que el frontend envía correctamente los datos
        // En producción suele reemplazarse por logging estructurado o eliminarse
        console.log("BODY RECIBIDO:", req.body); // CLAVE


        try {
            // Llamamos al servicio de usuario, pasando los datos recibidos
            // Aquí ocurre la lógica real de negocio (validaciones, persistencia, etc.)
            const photoPath = req.files?.photo?.[0]
                ? `uploads/${req.files.photo[0].filename}`
                : null;

            const technicalSheetPath = req.files?.materialTechnicalSheet?.[0]
                ? `uploads/${req.files.materialTechnicalSheet[0].filename}`
                : null;
            const returnableMaterial = await returnableMaterialService.createReturnableMaterial({
                ...req.body,
                photo: photoPath,
                materialTechnicalSheet: technicalSheetPath,
            });


            // Respuesta HTTP en caso de éxito
            // 201: recurso creado correctamente según el estándar REST
            res.status(201).json({
                // Mensaje informativo para el cliente
                message: "Material devolutivo creado correctamente",


                // Retornamos únicamente el ID del usuario creado
                // Evita exponer información sensible innecesaria
                returnableMaterialId: returnableMaterial.id,
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

    async list(req, res) {
        try {
            const returnables = await returnableMaterialService.getAllReturnable();
            res.status(200).json(returnables);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const returnable = await returnableMaterialService.getReturnableById(id);
            if (!returnable) return res.status(404).json({ error: "Material devolutivo no encontrado" });
            res.status(200).json(returnable);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const photoPath = req.files?.photo?.[0]
                ? `uploads/${req.files.photo[0].filename}`
                : null;
            const technicalSheetPath = req.files?.materialTechnicalSheet?.[0]
                ? `uploads/${req.files.materialTechnicalSheet[0].filename}`
                : null;

            const updated = await returnableMaterialService.updateReturnable(id, {
                ...req.body,
                materialTechnicalSheet: technicalSheetPath,
                photo: photoPath,
            });

            if (!updated) return res.status(404).json({ error: "Material devolutivo no encontrado" });
            res.status(200).json({ message: "Material actualizado correctamente", material: updated });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // returnableMaterial.controller.js
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updated = await returnableMaterialService.updateReturnableStatus(id, status);
            if (!updated) return res.status(404).json({ error: "Material devolutivo no encontrado" });
            res.status(200).json(updated);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

};
