// Capa de lógica de negocio para nombres de inventario. Depende del
// repository para persistencia, pero el repository no conoce el service.
import { inventoryNameRepository } from "./inventoryName.repository.js";

export const inventoryNameService = {

  async createInventoryName(data) {
    // El frontend envía "inventoryName" (camelCase); la columna real es
    // "inventory_name". Aceptamos ambas formas por si acaso.
    const inventory_name = (data.inventory_name ?? data.inventoryName ?? "").trim();
    return await inventoryNameRepository.create({ inventory_name });
  },

  async getAllInventoryNames() {
    return await inventoryNameRepository.findAll();
  },

  async getInventoryNameById(id) {
    return await inventoryNameRepository.findById(id);
  },

  async updateInventoryName(id, data) {
    const inventory_name = (data.inventory_name ?? data.inventoryName ?? "").trim();
    return await inventoryNameRepository.update(id, { inventory_name });
  },

  async updateInventoryNameStatus(id, status) {
    return await inventoryNameRepository.updateStatus(id, status);
  },

};
