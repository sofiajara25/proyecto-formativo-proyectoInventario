import { useState } from "react";
import { createPortal } from "react-dom";
import { Input, Button, Modal, TextArea, Select } from "@/shared";
import { taskSchema } from "../schemas/taskSchema";
import { createTask } from "../services/taskService";
// import { getUsers } from "../../users/services/userService";

export default function TasksRegisterForm({ users, onClose }) {


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        taskName: "",
        taskDescription: "",
        taskDeliveryDate: "",
        taskCreationDate: "",
        userId: "",
    });
    const [errors, setErrors] = useState({});
    const [userDates, setUserDates] = useState({ start_date: "", end_date: "" });

    // Fecha de hoy en formato YYYY-MM-DD usando la zona horaria local
    // (evita el corrimiento de un día que da new Date().toISOString()).
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const localToday = `${yyyy}-${mm}-${dd}`;

    const handleChange = (eOrValue, nameFromSelect) => {
        if (eOrValue?.target) {
            // caso input normal
            const { name, value } = eOrValue.target;
            setFormData((prev) => ({ ...prev, [name]: value }));

            if (name === "userId") {
                const selectedUser = users.find((u) => u.id.toString() === value);
                if (selectedUser) {
                    setUserDates({
                        start_date: selectedUser.start_date,
                        end_date: selectedUser.end_date,
                    });
                }
            }
        } else {
            // caso Select (solo valor)
            const value = eOrValue;
            const name = nameFromSelect;
            setFormData((prev) => ({ ...prev, [name]: value }));

            if (name === "userId") {
                const selectedUser = users.find((u) => u.id.toString() === value);
                if (selectedUser) {
                    setUserDates({
                        start_date: selectedUser.start_date,
                        end_date: selectedUser.end_date,
                    });
                }
            }
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSubmitting(true);

        const result = taskSchema(userDates.start_date, userDates.end_date).safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        setErrors({});
        try {
            // 🔹 Crear usuario en backend
            const response = await createTask(result.data);
            console.log("Tarea creado:", response);

        } catch (error) {
            console.error("Error:", error.message);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    };

    // 🔑 Portal — renderiza FUERA del DOM del form padre, en document.body
    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4"
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-[380px] lg:max-w-[740px] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-xl sm:text-2xl font-medium text-center text-gray-900">
                    Asignar tarea
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 lg:mx-5 md:mx-2 mt-8"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-items-center lg:justify-items-stretch">

                        <Input
                            label="Nombre"
                            name="taskName"
                            placeholder="Ingrese el nombre"
                            type="text"
                            value={formData.taskName}
                            onChange={handleChange}
                            error={errors.taskName}
                        />
                        {userDates.start_date && userDates.end_date && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-2 text-xs">
                                <p className="text-blue-800">
                                    Este usuario tiene rango de fechas desde{" "}
                                    <strong>{new Date(userDates.start_date).toLocaleDateString()} </strong>
                                    hasta{" "}
                                    <strong>{new Date(userDates.end_date).toLocaleDateString()}</strong>.
                                    Las tareas deben estar dentro de este intervalo.
                                </p>
                            </div>
                        )}

                        {/* Fechas de la tarea */}
                        <Input
                            label="Fecha de creación"
                            name="taskCreationDate"
                            type="date"
                            value={formData.taskCreationDate}
                            onChange={handleChange}
                            error={errors.taskCreationDate}
                            min={localToday}
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
                            label="Fecha de entrega"
                            name="taskDeliveryDate"
                            type="date"
                            value={formData.taskDeliveryDate}
                            onChange={handleChange}
                            error={errors.taskDeliveryDate}
                            min={formData.taskCreationDate || localToday}
                        />
                        {/* Select de usuarios */}

                        <Select
                            label="Asignar a usuario"
                            name="userId"
                            options={users.map((u) => ({
                                value: u.id.toString(),
                                label: `${u.user_name} ${u.user_lastname}`,
                            }))}
                            value={formData.userId}
                            onChange={(value) => handleChange(value, "userId")}
                            error={errors.userId}
                        />

                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="secondary" size="md" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" size="md" type="submit">
                            {isSubmitting ? "Creando..." : "Crear tarea"}
                        </Button>
                    </div>
                </form>

                <Modal
                    isOpen={isModalOpen}
                    title="Confirmar creación de tarea"
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleSubmit}
                    confirmText="Crear"
                    cancelText="Cancelar"
                >
                    <p>¿Seguro que deseas guardar esta tarea?</p>
                </Modal>
            </div >
        </div >,
        document.body // 🔑 se monta directo en body, fuera del form padre
    );
}