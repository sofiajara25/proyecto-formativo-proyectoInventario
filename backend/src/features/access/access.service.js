// backend/src/features/access/access.service.js

import { accessRepository } from "./access.repository.js";

export const accessService = {
    async hasPermission(userId) {
        // Traemos el usuario con su status
        const user = await accessRepository.findById(userId);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        // Validamos que esté activo
        return user.user_status === "Activo";
    },
};
