import { taskRepository } from "./task.repository.js";

export const taskService = {
    async createTask(data) {
        // Evita crear la misma tarea dos veces (ej. por hacer click varias
        // veces en "Crear tarea"). Va fuera del try de abajo para que el
        // error conserve su status 409 y su mensaje tal cual.
        if (data.userId) {
            const duplicate = await taskRepository.findDuplicate(data);
            if (duplicate) {
                const error = new Error(
                    "Ya creaste esta tarea para este usuario con la misma fecha de entrega"
                );
                error.status = 409;
                throw error;
            }
        }

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
    },

    // La foto es obligatoria: sin ella no se puede marcar la tarea como
    // hecha. El controller ya valida que llegó un archivo antes de llamar
    // aquí, pero lo revisamos también en el service por si se usa desde
    // otro lado.
    async submitEvidence(id, evidencePhoto) {
        if (!evidencePhoto) {
            throw new Error("Debes adjuntar una foto como evidencia");
        }

        const task = await taskRepository.submitEvidence(id, evidencePhoto);

        if (!task) {
            throw new Error("La tarea no existe o ya no está pendiente");
        }

        return task;
    },

    async confirmTask(id, approve) {
        const task = await taskRepository.confirm(id, approve);

        if (!task) {
            throw new Error("Tarea no encontrada");
        }

        return task;
    },

    async getPendingConfirmation(creatorId) {
        return await taskRepository.findPendingConfirmationByCreator(creatorId);
    },
};
