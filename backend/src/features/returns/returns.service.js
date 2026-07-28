// Importamos el repositorio de usuarios.
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { returnRepository } from "./returns.repository.js";

import bcrypt from "bcrypt";

// Exportamos el servicio de usuarios.
// El service representa la capa de lógica de negocio de la aplicación.
export const returnService = {
    // Crear una devolución
    async createReturn(data) {
        // Normalizamos datos si es necesario
        const returnData = {
            ...data,
            materialType: data.materialType?.toLowerCase(),
        };

        console.log("SERVICE RETURN DATA:", returnData);

        // Delegamos al repository
        return await returnRepository.create(returnData);
    },

    async getAllReturn() {
        return await returnRepository.findAll();
    },
    async getReturnById(id) {
        return await returnRepository.findById(id);
    },

    async updateReturn(id, data) {
        return await returnRepository.update(id, data);
    },

    async updateReturnStatus(id, isAvailable) {
        return await returnRepository.updateStatus(id, isAvailable);
    }
};
