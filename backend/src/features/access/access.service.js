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

    // Resumen de acceso del usuario logueado: se guarda en el frontend
    // justo después del login (ver Login.jsx -> saveAccess) y de ahí lo
    // leen isAdmin()/hasPermission() en shared/utils/permissions.js.
    async getMyAccess(userId) {
        const userType = await accessRepository.getUserType(userId);

        if (!userType) {
            return { userType: null, isAdmin: false, permissions: [] };
        }

        const isAdminUser = userType === "Administrador";
        const permissions = await accessRepository.getUserPermissions(userId);

        return { userType, isAdmin: isAdminUser, permissions };
    },
};
