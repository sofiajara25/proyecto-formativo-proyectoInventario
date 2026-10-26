import { groupsRepository } from "./groups.repository.js";

// Error con status HTTP, para que el controller responda 400/404/409 con el
// mensaje tal cual en vez de un 500 genérico.
function httpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

export const groupsService = {
    async updateName(groupId, groupName) {
        const name = groupName?.trim();
        if (!name || name.length < 3) {
            throw httpError(400, "El nombre del grupo debe tener al menos 3 caracteres");
        }

        try {
            const group = await groupsRepository.updateName(groupId, name);
            if (!group) throw httpError(404, "Grupo no encontrado");
            return group;
        } catch (err) {
            // 23505 = violación de UNIQUE en PostgreSQL (group_name es UNIQUE)
            if (err?.code === "23505") {
                throw httpError(409, "Ya existe un grupo con ese nombre");
            }
            throw err;
        }
    },

    // groups.service.js
    async createGroup(groupData) {
        return await groupsRepository.create(groupData);
    },

    async getAll() {
        return await groupsRepository.getAll();
    },

    async getPermissionsByGroupId(group_id) {
        return await groupsRepository.getPermissionsByGroupId(group_id);
    },
    async updatePermissions(groupId, permissionIds) {
        return await groupsRepository.updatePermissions(groupId, permissionIds);
    }
};