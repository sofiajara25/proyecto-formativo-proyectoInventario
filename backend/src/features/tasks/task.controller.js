import { taskService } from "./task.service.js";

export const taskController = {
    async create(req, res) {
        try {
            const task = await taskService.createTask(req.body);

            res.status(201).json({
                message: "Tarea creada correctamente",
                id: task.id,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getByUser(req, res) {
        try {
            const userName = req.query.userName;
            if (!userName) {
                return res.status(400).json({ error: "Falta el parametro userName" });
            }

            const tasks = await taskService.getTasksByUserName(userName);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getByUserId(req, res) {
        try {
            const { userId } = req.params;
            const tasks = await taskService.getTasksByUserId(userId);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getAll(req, res) {
        try {
            const tasks = await taskService.getAllTasks();
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updatedTask = await taskService.updateTask(id, req.body);
            res.json({
                message: "Tarea actualizada correctamente",
                task: updatedTask,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
