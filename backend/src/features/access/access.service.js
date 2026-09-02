// backend/src/features/access/access.service.js

import { accessRepository } from "./access.repository.js";

export const accessService = {
    // Sin atajos: el permiso se revisa contra lo que el usuario tiene
    // asignado (directo o por grupo), sin bypass para ningún grupo,
    // ni siquiera "Administrador".
    async hasPermission(userId, permissionCodename) {
        const permissions = await accessRepository.getUserPermissions(userId);
        return permissions.includes(permissionCodename);
    },

    // Resumen de acceso del usuario logueado: se guarda en el frontend
    // justo después del login (ver Login.jsx -> saveAccess) y de ahí lo
    // lee hasPermission() en shared/utils/permissions.js.
    //
    // userType/isAdmin ya NO habilitan ningún atajo de permisos: son
    // solo una etiqueta (nombre del grupo) que la interfaz usa para
    // decidir qué mostrar, ej. Navbar.jsx elige entre "Últimos
    // préstamos" o "Tareas asignadas". El acceso real siempre sale de
    // "permissions".
    async getMyAccess(userId) {
        const userType = await accessRepository.getUserType(userId);
        const isAdminUser = userType === "Administrador";
        const permissions = await accessRepository.getUserPermissions(userId);
        const isSuperAdminUser = await accessRepository.isSuperAdmin(userId);

        return {
            userType,
            isAdmin: isAdminUser,
            isSuperAdmin: isSuperAdminUser,
            permissions,
        };
    },
};
