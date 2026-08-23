// El controller no implementa lógica de negocio, solo delega al service y
// traduce el resultado a una respuesta HTTP.
import { inventoryNameService } from "./inventoryName.service.js";

export const inventoryNameController = {

  async create(req, res) {
    try {
      const inventoryName = await inventoryNameService.createInventoryName(req.body);
      res.status(201).json(inventoryName);
    } catch (err) {
      console.error("ERROR BACKEND:", err);
      res.status(500).json({ error: err.message });
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

  async getById(req, res) {
    try {
      const { id } = req.params;
      const inventoryName = await inventoryNameService.getInventoryNameById(id);
      if (!inventoryName) {
        return res.status(404).json({ error: "Nombre de inventario no encontrado" });
      }
      res.status(200).json(inventoryName);
    } catch (err) {
      console.error("ERROR BACKEND:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const inventoryName = await inventoryNameService.updateInventoryName(id, req.body);
      if (!inventoryName) {
        return res.status(404).json({ error: "Nombre de inventario no encontrado" });
      }
      res.status(200).json(inventoryName);
    } catch (err) {
      console.error("ERROR BACKEND:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await inventoryNameService.updateInventoryNameStatus(id, status);
      if (!updated) {
        return res.status(404).json({ error: "Nombre de inventario no encontrado" });
      }
      res.status(200).json(updated);
    } catch (err) {
      console.error("ERROR BACKEND:", err);
      res.status(500).json({ error: err.message });
    }
  },

};
