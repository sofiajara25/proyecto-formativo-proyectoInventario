import { useEffect, useState } from "react";
import { Input, Button, Modal, TextArea } from "@/shared";
import { taskSchema } from "../schemas/taskSchema";
import { updateTask } from "../services/taskService";
import { getUserById } from "../../users/services/userService";

export default function TaskUpdateForm({ task, onClose, onTaskUpdated }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        taskName: task?.name || "",
        taskDescription: task?.description || "",
        taskDeliveryDate: task?.dueDate?.slice(0, 10) || "",
        taskCreationDate: task?.createdAt?.slice(0, 10) || "",
        // El backend devuelve userId como número; el schema espera un
        // string ("z.string()"), así que hay que convertirlo o falla la
        // validación con "Invalid input: expected string, received number".
        userId: task?.userId != null ? String(task.userId) : "",
    });
    const [errors, setErrors] = useState({});
    // Datos ya validados, guardados aquí al enviar el formulario, para que
    // el modal de confirmación solo tenga que guardarlos (sin volver a
    // validar "a ciegas" detrás del modal, donde el usuario no vería si
    // algo falla).
    const [validatedData, setValidatedData] = useState(null);

    // taskSchema valida que las fechas de la tarea queden dentro del rango
    // de vinculación del usuario asignado (start_date/end_date), así que
    // hace falta traerlas antes de poder validar el formulario.
    const [userDates, setUserDates] = useState({ start_date: "", end_date: "" });

    useEffect(() => {
        if (!task?.userId) return;
        getUserById(task.userId)
            .then((data) => setUserDates({ start_date: data.start_date, end_date: data.end_date }))
            .catch((err) => console.error("Error cargando el usuario asignado:", err));
    }, [task?.userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Se ejecuta al enviar el formulario (antes de abrir el modal de
    // confirmación): así, si algo no pasa la validación, el error se ve de
    // una vez en el formulario en vez de quedar "escondido" detrás del
    // modal sin que el usuario entienda por qué no pasa nada al confirmar.
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!task?.id) {
            setErrors({ taskName: "Selecciona una tarea para actualizar" });
            return;
        }

        const result = taskSchema(userDates.start_date, userDates.end_date).safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            console.warn("Errores de validación al actualizar la tarea:", fieldErrors);
            return;
        }

        setErrors({});
        setValidatedData(result.data);
        setIsModalOpen(true);
    };

    // Se ejecuta al confirmar en el modal: ya no valida nada, solo guarda
    // los datos que quedaron listos en handleSubmit.
    const handleUpdateTask = async () => {
        if (!validatedData) return;

        try {
            const updated = await updateTask(task.id, validatedData);
            onTaskUpdated?.(updated);
            onClose();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error actualizando tarea:", err);
            alert(err.message);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-[380px] lg:max-w-[740px] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-xl sm:text-2xl font-medium text-center text-gray-900">
                    Editar tarea
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 lg:mx-5 md:mx-2 mt-8"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-items-center lg:justify-items-stretch">
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
