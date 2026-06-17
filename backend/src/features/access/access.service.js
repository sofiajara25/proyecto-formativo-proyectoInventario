// backend/src/features/access/access.service.js

import { accessRepository } from "./access.repository.js";

export const accessService = {
    async hasPermission(userId) {
        const userType = await accessRepository.getUserType(userId);

        if (!userType) {
            throw new Error("Usuario no encontrado");
        }

        // Solo los administradores tienen permiso
        return userType === "Administrador";
    },
};
