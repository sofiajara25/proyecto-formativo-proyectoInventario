import { groupsRepository } from "./groups.repository.js";

export const groupsService = {
    async create(data) {
        if (!data.groupName?.trim()) {
            throw new Error("El nombre del grupo es obligatorio");
        }

        return await groupsRepository.create({
            groupName: data.groupName.trim(),
        });
    },

    async getAll() {
        return await groupsRepository.getAll();
    },

    async getPermissionsByGroupId(group_id) {
        return await groupsRepository.getPermissionsByGroupId(group_id);
    },
};
