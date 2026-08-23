// Importamos el repositorio de usuarios.
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { returnableMaterialRepository } from "./returnableMaterial.repository.js";


// Exportamos el servicio de usuarios.
// El service representa la capa de lógica de negocio de la aplicación.
export const returnableMaterialService = {


    // Método encargado de crear un material devolutivo
    // Recibe datos provenientes del controller,
    // idealmente ya validados a nivel estructural (DTO / schema)
    async createReturnableMaterial(data) {
        // Reglas de negocio básicas:
        // - Calcular el valor total si no viene
        // - Normalizar estado (ej. "activo"/"inactivo")
        // - Validar cantidad > 0

        const materialData = {
            ...data,
            totalValue: data.totalValue ?? (data.unitValue * data.quantity),
            status: data.status?.toLowerCase(),
        };

        console.log("SERVICE DATA:", materialData);

        // Delegamos al repository
        return await returnableMaterialRepository.create(materialData);
    },

    // Vista previa del tool_id que se asignará al próximo material creado.
    // Debe usar el mismo formato que returnableMaterial.repository.create().
    async previewNextToolId() {
        const nextId = await returnableMaterialRepository.getNextId();
        return `DEV-${String(nextId).padStart(4, "0")}`;
    },

    async getAllReturnable() {
        return await returnableMaterialRepository.findAll();
    },

    async getReturnableById(id) {
        return await returnableMaterialRepository.findById(id);
    },

    async updateReturnable(id, data) {
        return await returnableMaterialRepository.update(id, data);
    },

    // returnableMaterial.service.js
    async updateReturnableStatus(id, status) {
        return await returnableMaterialRepository.updateStatus(id, status);
    }

};
