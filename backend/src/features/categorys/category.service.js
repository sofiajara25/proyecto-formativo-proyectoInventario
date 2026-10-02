// Importamos el repositorio de usuarios.
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { categoryRepository } from "./category.repository.js";

// Error con status HTTP, para que el controller responda 400/409 con el
// mensaje tal cual en vez de un 500 genérico.
function httpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

// 23505 = violación de UNIQUE en PostgreSQL: ya existe una categoría con
// ese nombre (índice categorys_name_unique, ver migración 085).
function translateDuplicate(err) {
    if (err?.code === "23505") {
        return httpError(409, "Ya existe una categoría con ese nombre");
    }
    return err;
}


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

        // El repository espera "categoryName" (así llega del frontend).
        const categoryName = data.categoryName?.trim();
        if (!categoryName) {
            throw httpError(400, "El nombre de la categoría es obligatorio");
        }

        try {
            return await categoryRepository.create({ categoryName });
        } catch (err) {
            throw translateDuplicate(err);
        }
    },

    async getAllCategorys() {
        return await categoryRepository.findAll();
    },

    async getCategoryById(id) {
        return await categoryRepository.findById(id);
    },

    async updateCategory(id, data) {
        const current = await categoryRepository.findById(id);
        if (!current) return null;

        const categoryName = data.categoryName?.trim();
        if (!categoryName) {
            throw httpError(400, "El nombre de la categoría es obligatorio");
        }

        // Las 3 categorías por defecto deben existir siempre: renombrarlas
        // sería lo mismo que quitarlas.
        if (current.is_default && categoryName !== current.category_name) {
            throw httpError(409, "Esta es una categoría por defecto del sistema y no se puede renombrar");
        }

        try {
            return await categoryRepository.update(id, { categoryName });
        } catch (err) {
            throw translateDuplicate(err);
        }
    },

    async updateCategoryStatus(id, status) {
        const current = await categoryRepository.findById(id);
        if (!current) return null;

        // Las 3 categorías por defecto deben estar siempre activas.
        if (current.is_default && String(status).trim().toLowerCase() !== "activo") {
            throw httpError(409, "Esta es una categoría por defecto del sistema y no se puede desactivar");
        }

        return await categoryRepository.updateStatus(id, status);
    }

};
