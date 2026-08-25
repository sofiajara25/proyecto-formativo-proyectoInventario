// Importamos el servicio de usuarios.
// El controller NO implementa lógica de negocio,
// solo delega la operación al service correspondiente.
import { categoryService } from "./category.service.js";


// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)
export const categoryController = {


    // Método encargado de manejar la creación de un usuario
    // Se asume que este método será usado como handler de una ruta Express
    async create(req, res) {
        try {
            const category = await categoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },
    async list(req, res) {
        try {
            const categorys = await categoryService.getAllCategorys();
            res.status(200).json(categorys);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },

    // category.controller.js
    async getById(req, res) {
        try {
            const { id } = req.params;
            const category = await categoryService.getCategoryById(id);
            if (!category) return res.status(404).json({ error: "Categoría no encontrada" });
            res.status(200).json(category);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getAll(req, res) {
        try {
            const categorys = await categoryService.getAllCategorys();
            res.status(200).json(categorys);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const category = await categoryService.updateCategory(id, req.body);
            if (!category) return res.status(404).json({ error: "Categoría no encontrada" });
            res.status(200).json({ message: "Categoría actualizada correctamente", category });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updated = await categoryService.updateCategoryStatus(id, status);
            if (!updated) return res.status(404).json({ error: "Categoría no encontrada" });
            res.status(200).json(updated);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

};
