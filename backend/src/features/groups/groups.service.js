import { groupsRepository } from "./groups.repository.js";

export const groupsService = {
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