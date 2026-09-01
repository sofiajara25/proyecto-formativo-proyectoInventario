import { taskService } from "./task.service.js";

export const taskController = {
    async create(req, res) {
        try {
            // req.user viene del middleware authenticateToken: la persona
            // que crea la tarea queda registrada como quien la asignó, para
            // luego poder avisarle cuando se suba la evidencia.
            const task = await taskService.createTask({
                ...req.body,
                createdBy: req.user?.id ?? null,
            });

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
            // Si la tarea todavía no tenía dueño (tareas viejas, creadas
            // antes de que existiera "created_by"), el repository la deja a
            // nombre de quien la edite ahora. Si ya tenía dueño, no cambia.
            const updatedTask = await taskService.updateTask(id, {
                ...req.body,
                editedBy: req.user?.id ?? null,
            });
            res.json({
                message: "Tarea actualizada correctamente",
                task: updatedTask,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Quien tiene la tarea asignada sube la foto de evidencia. La foto es
    // obligatoria: si no llegó ningún archivo, no se deja marcar como hecha.
    async submitEvidence(req, res) {
        try {
            const { id } = req.params;

            if (!req.file) {
                return res.status(400).json({ error: "Debes adjuntar una foto como evidencia" });
            }

            const evidencePhoto = `uploads/${req.file.filename}`;
            const task = await taskService.submitEvidence(id, evidencePhoto);

            res.json({ message: "Evidencia enviada, esperando confirmación", task });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Quien creó la tarea la aprueba (queda "Completada") o la rechaza
    // (vuelve a "Pendiente" para que se vuelva a hacer).
    async confirm(req, res) {
        try {
            const { id } = req.params;
            const { approve } = req.body;

            const task = await taskService.confirmTask(id, Boolean(approve));
            res.json({ message: "Tarea actualizada", task });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Tareas que el usuario logueado creó/asignó y que están esperando su
    // confirmación (ya se subió evidencia). Se usa en la campana del navbar.
    async getPendingConfirmation(req, res) {
        try {
            const tasks = await taskService.getPendingConfirmation(req.user.id);
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
