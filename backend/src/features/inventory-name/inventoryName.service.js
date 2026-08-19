// Importamos el repositorio de usuarios.
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { inventoryNameRepository } from "./inventoryName.repository.js";


// Exportamos el servicio de usuarios.
// El service representa la capa de lógica de negocio de la aplicación.
export const inventoryNameService = {
    // Método encargado de crear un material de consumo
    // Recibe datos provenientes del controller,
    // idealmente ya validados a nivel estructural (DTO / schema)
    async createInventoryName(data) {
        // Reglas de negocio básicas:
        // - Normalizar el nombre (ej. trim y capitalizar)
        // - Validar longitud mínima/máxima (ya lo hace Zod en el schema)
        // - Evitar duplicados (opcional, depende de tu lógica)

        const inventoryNameData = {
            ...data,
            inventoryName: data.inventoryName.trim(),
        };

        console.log("SERVICE DATA:", inventoryNameData);

        // Delegamos al repository
        return await inventoryNameRepository.create(inventoryNameData);
    },

    async getAllInventoryNames() {
        return await inventoryNameRepository.findAll();
    },

    async getInventoryNameById(inventory_name_id) {
        return await inventoryNameRepository.findById(inventory_name_id);
    },

    async updateInventoryName(inventory_name_id, data) {
        return await inventoryNameRepository.update(inventory_name_id, data);
    },

    async updateInventoryNameStatus(inventory_name_id, status) {
        return await inventoryNameRepository.updateStatus(inventory_name_id, status);
    }

};
