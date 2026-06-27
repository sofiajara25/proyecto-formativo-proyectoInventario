// Importamos el repositorio de usuarios.
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { brandRepository } from "./brand.repository.js";


// Exportamos el servicio de usuarios.
// El service representa la capa de lógica de negocio de la aplicación.
export const brandService = {
    // Método encargado de crear un material de consumo
    // Recibe datos provenientes del controller,
    // idealmente ya validados a nivel estructural (DTO / schema)
    async createBrand(data) {
        // Reglas de negocio básicas:
        // - Normalizar el nombre (ej. trim y capitalizar)
        // - Validar longitud mínima/máxima (ya lo hace Zod en el schema)
        // - Evitar duplicados (opcional, depende de tu lógica)

        const brandData = {
            ...data,
            marca: data.marca.trim(),
        };

        console.log("SERVICE DATA:", brandData);

        // Delegamos al repository
        return await brandRepository.create(brandData);
    },

    async getAllBrands() {
        return await brandRepository.findAll();
    },

    async getBrandById(id) {
        return await brandRepository.findById(id);
    },

    async updateBrand(id, data) {
        return await brandRepository.update(id, data);
    }

};
