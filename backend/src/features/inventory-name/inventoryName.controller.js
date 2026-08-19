// Importamos el servicio de usuarios.
// El controller NO implementa lógica de negocio,
// solo delega la operación al service correspondiente.
import { inventoryNameService } from "./inventoryName.service.js";


// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)
export const inventoryNameController = {


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
            const inventory = await inventoryNameService.createInventoryName(req.body);


            // Respuesta HTTP en caso de éxito
            // 201: recurso creado correctamente según el estándar REST
            res.status(201).json({
                // Mensaje informativo para el cliente
                message: "El nombre del inventario creadao correctamente",


                // Retornamos únicamente el ID del usuario creado
                // Evita exponer información sensible innecesaria
                inventoryNameId: inventory.inventory_name_id,
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
            const inventoryNames = await inventoryNameService.getAllInventoryNames();
            res.status(200).json(inventoryNames);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },

    // inventory.controller.js
    async getById(req, res) {
        try {
            const { inventory_name_id } = req.params;
            const inventory = await inventoryNameService.getInventoryNameById(inventory_name_id);
            if (!inventory) return res.status(404).json({ error: "Nombre de inventario no encontrada" });
            res.status(200).json(inventory);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getAll(req, res) {
        try {
            const inventoryNames = await inventoryNameService.getAllInventoryNames();
            res.status(200).json(inventoryNames);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const { inventory_name_id } = req.params;
            const inventory = await inventoryNameService.updateInventoryName(inventory_name_id, req.body);
            if (!inventory) return res.status(404).json({ error: "Nombre de inventario no encontrada" });
            res.status(200).json({ message: "Nombre de inventario actualizada correctamente", inventory });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async updateStatus(req, res) {
        try {
            const { inventory_name_id } = req.params;
            const { status } = req.body;
            const updated = await inventoryNameService.updateInventoryNameStatus(inventory_name_id, status);
            if (!updated) return res.status(404).json({ error: "Nombre de inventario no encontrada" });
            res.status(200).json(updated);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

};
