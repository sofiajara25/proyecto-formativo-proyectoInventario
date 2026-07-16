import { taskRepository } from "./task.repository.js";

export const taskService = {
    async createTask(data) {
        try {
            if (!data.userId) {
                throw new Error("El campo userId es obligatorio");
            }

            return await taskRepository.create(data);
        } catch (error) {
            throw new Error("Error creando la tarea: " + error.message);
        }
    },

    async getTasksByUserName(userName) {
        return await taskRepository.findByUserName(userName);
    },

    async getTasksByUserId(userId) {
        return await taskRepository.findByUserId(userId);
    },

    async getAllTasks() {
        return await taskRepository.findAll();
    },

    async updateTask(id, data) {
        return await taskRepository.update(id, data);
    }

};
