    import { useState } from "react";
    import { createPortal } from "react-dom";
    import { Input, Button, Modal, TextArea } from "@/shared";
    import { taskSchema } from "../schemas/taskSchema";

    export default function TasksRegisterForm({ userId, onClose, onSaveTask }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        taskName: "",
        taskDescription: "",
        taskDeliveryDate: "",
        taskCreationDate: "",
        userId: userId,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleValidate = (e) => {
        e.preventDefault();
        e.stopPropagation();
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
        setIsModalOpen(true);
    };

    const handleSaveTask = () => {
        const result = taskSchema.safeParse(formData);
        if (!result.success) return;
        onSaveTask(result.data); // ✅ guarda en memoria, no envía a BD
        setIsModalOpen(false);
        onClose();
    };

    // 🔑 Portal — renderiza FUERA del DOM del form padre, en document.body
    return createPortal(
        <div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
        onClick={(e) => e.stopPropagation()}
        >
        <div
            className="bg-white rounded-lg shadow-lg p-6 w-[740px]"
            onClick={(e) => e.stopPropagation()}
        >
            <h1 className="text-2xl font-medium text-center text-gray-900">
            Asignar tarea
            </h1>

            <form
            onSubmit={handleValidate}
            className="flex flex-col gap-4 lg:mx-5 md:mx-2 mt-8"
            >
            <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">

                <Input
                label="Nombre"
                name="taskName"
                placeholder="Ingrese el nombre"
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
                label="Descripción"
                name="taskDescription"
                placeholder="Ingrese la descripción"
                value={formData.taskDescription}
                onChange={handleChange}
                error={errors.taskDescription}
                rows={1}
                />

                <Input
                label="Fecha de creación"
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
                Guardar tarea
                </Button>
            </div>
            </form>

            <Modal
            isOpen={isModalOpen}
            title="Confirmar creación de tarea"
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleSaveTask}
            confirmText="Guardar"
            cancelText="Cancelar"
            >
            <p>¿Seguro que deseas guardar esta tarea?</p>
            </Modal>
        </div>
        </div>,
        document.body // 🔑 se monta directo en body, fuera del form padre
    );
    }