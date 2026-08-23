// Importamos el repositorio de usuarios.
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { consumableMaterialRepository } from "./consumableMaterial.repository.js";

import bcrypt from "bcrypt";

// Exportamos el servicio de usuarios.
// El service representa la capa de lógica de negocio de la aplicación.
export const consumableMaterialService = {
    // Método encargado de crear un material de consumo
    // Recibe datos provenientes del controller,
    // idealmente ya validados a nivel estructural (DTO / schema)
    async createConsumableMaterial(data) {
        // Reglas de negocio básicas:
        // - Calcular el valor total si no viene
        // - Validar cantidad > 0
        // - Normalizar estado (ej. "activo"/"inactivo")

        const materialData = {
            ...data,
            totalValue: data.totalValue ?? (data.unitValue * data.quantity),
            status: data.status?.toLowerCase(),
        };

        console.log("SERVICE DATA:", materialData);

        // Delegamos al repository
        return await consumableMaterialRepository.create(materialData);
    },

    // Vista previa del tool_id que se asignará al próximo material creado.
    // Debe usar el mismo formato que consumableMaterial.repository.create().
    async previewNextToolId() {
        const nextId = await consumableMaterialRepository.getNextId();
        return `CON-${String(nextId).padStart(4, "0")}`;
    },

    async getAllConsumables() {
        return await consumableMaterialRepository.findAll();
    },

    async getConsumableById(id) {
        return await consumableMaterialRepository.findById(id);
    },

    async updateConsumable(id, data) {
        return await consumableMaterialRepository.update(id, data);
    },

    async updateConsumableStatus(id, status) {
        return await consumableMaterialRepository.updateStatus(id, status);
    }

};
