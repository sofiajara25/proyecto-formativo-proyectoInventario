import { groupsRepository } from "./groups.repository.js";

export const groupsService = {
    async getAll() {
        return await groupsRepository.getAll();
    },

    async getPermissionsByGroupId(group_id) {
        return await groupsRepository.getPermissionsByGroupId(group_id);
    },
};