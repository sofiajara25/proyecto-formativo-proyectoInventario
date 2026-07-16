import { useState } from "react";
import { Input, Button, Modal, TextArea } from "@/shared";
import { taskSchema } from "../schemas/taskSchema";
import { updateTask } from "../services/taskService";

export default function TaskUpdateForm({ task, onClose, onTaskUpdated }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        taskName: task?.name || "",
        taskDescription: task?.description || "",
        taskDeliveryDate: task?.dueDate?.slice(0, 10) || "",
        taskCreationDate: task?.createdAt?.slice(0, 10) || "",
        userId: task?.userId || "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateTask = async () => {
        if (!task?.id) {
            setErrors({ taskName: "Selecciona una tarea para actualizar" });
            return;
        }

        const result = taskSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        try {
            const updated = await updateTask(task.id, result.data);
            onTaskUpdated(updated);
            onClose();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error actualizando tarea:", err);
            alert(err.message);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-[740px] h-[330px]"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-2xl font-medium text-center text-gray-900">
                    Editar tarea
                </h1>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setIsModalOpen(true);
                    }}
                    className="flex flex-col gap-4 lg:mx-5 md:mx-2 mt-8"
                >
                    <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
                        <Input
                            label="Nombre"
                            name="taskName"
                            type="text"
                            value={formData.taskName}
                            onChange={handleChange}
                            error={errors.taskName}
                        />

                        <Input
                            label="Fecha de entrega"
                            name="taskDeliveryDate"
                            type="date"
                            value={formData.taskDeliveryDate}
                            onChange={handleChange}
                            error={errors.taskDeliveryDate}
                        />

                        <TextArea
                            label="Descripcion"
                            name="taskDescription"
                            value={formData.taskDescription}
                            onChange={handleChange}
                            error={errors.taskDescription}
                            rows={1}
                        />

                        <Input
                            label="Fecha de creacion"
                            name="taskCreationDate"
                            type="date"
                            value={formData.taskCreationDate}
                            onChange={handleChange}
                            error={errors.taskCreationDate}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="secondary" size="md" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" size="md" type="submit">
                            Actualizar tarea
                        </Button>
                    </div>
                </form>

                <Modal
                    isOpen={isModalOpen}
                    title="Confirmar actualizacion"
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleUpdateTask}
                    confirmText="Actualizar"
                    cancelText="Cancelar"
                >
                    <p>Seguro que deseas actualizar esta tarea?</p>
                </Modal>
            </div>
        </div>
    );
}
