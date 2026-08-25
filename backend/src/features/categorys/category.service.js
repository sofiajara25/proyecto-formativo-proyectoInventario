// Importamos el repositorio de usuarios.
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { categoryRepository } from "./category.repository.js";


// Exportamos el servicio de usuarios.
// El service representa la capa de lógica de negocio de la aplicación.
export const categoryService = {
    // Método encargado de crear un material de consumo
    // Recibe datos provenientes del controller,
    // idealmente ya validados a nivel estructural (DTO / schema)
    async createCategory(data) {
        // Reglas de negocio básicas:
        // - Normalizar el nombre (ej. trim y capitalizar)
        // - Validar longitud mínima/máxima (ya lo hace Zod en el schema)
        // - Evitar duplicados (opcional, depende de tu lógica)

        // El repository espera "categoryName"/"categoryElementType" (así
        // llegan del frontend); antes esto intentaba leer "category_name"
        // (snake_case), que no existe en "data", y eso rompía la creación
        // con "Cannot read properties of undefined (reading 'trim')".
        const categoryData = {
            ...data,
            categoryName: data.categoryName?.trim(),
        };

        console.log("SERVICE DATA:", categoryData);

        // Delegamos al repository
        return await categoryRepository.create(categoryData);
    },

    async getAllCategorys() {
        return await categoryRepository.findAll();
    },

    async getCategoryById(id) {
        return await categoryRepository.findById(id);
    },

    async updateCategory(id, data) {
        return await categoryRepository.update(id, data);
    },

    async updateCategoryStatus(id, status) {
        return await categoryRepository.updateStatus(id, status);
    }

};
