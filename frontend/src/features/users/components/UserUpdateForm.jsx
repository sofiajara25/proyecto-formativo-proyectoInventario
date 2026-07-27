import { useState, useEffect } from "react";
import { Input, Button, Select, Navbar, FileInput, Modal } from "@/shared";
import { getDocumentType } from "../services/selectServices.js";
import { userSchema } from "../schemas/userSchema";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../services/userService";
import { z } from "zod";
import { Pencil } from "lucide-react";
import { TasksUpdateForm } from "@/features/tasks";
import { getTasksByUserId } from "../../tasks/services/taskService.js";
import { getGroups } from "../../access/services/groupService.js";


const updateUserSchema = userSchema.safeExtend({
    userPassword: z.union([userSchema.shape.userPassword, z.literal("")]),
});

export default function UserUpdateForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [documentType, setDocumentType] = useState([]);
    const [formData, setFormData] = useState({
        userName: "",
        userDocumentType: "",
        userDocumentNumber: "",
        groupId: "",
        userEndDate: "",
        userStartDate: "",
        userEmail: "",
        userAddress: "",
        userPhone: "",
        userStatus: "",
        userPassword: "",
        userPhoto: [],
    });
    const [errors, setErrors] = useState({});

    const [groups, setGroups] = useState([]);
    const groupOptions = [
        { value: "", label: "Selecciona tu opción" },
        ...groups.map(g => ({
            value: String(g.group_id),   // 👈 convertir a string
            label: g.group_name,
        }))
    ];

    useEffect(() => {
        getGroups().then(setGroups).catch(err => console.error(err));
    }, []);

    const estados = [
        { value: "", label: "Selecciona tu opción" },
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" },
    ];

    // Cargar datos actuales
    useEffect(() => {
        getUserById(id).then((data) => {
            setFormData({
                userName: data.user_name || "",
                userDocumentType: data.document_type || "",
                userDocumentNumber: data.document_number || "",
                groupId: data.group_id ? String(data.group_id) : "",
                userStartDate: data.start_date?.slice(0, 10) || "",
                userEndDate: data.end_date?.slice(0, 10) || "",
                userEmail: data.user_email || "",
                userAddress: data.user_address || "",
                userPhone: data.user_phone || "",
                userStatus: data.user_status || "",
                userPassword: "",
                userPhoto: [],
            });
        });
    }, [id]);
    useEffect(() => {
        getDocumentType().then(setDocumentType);
    }, []);

    useEffect(() => {
        getTasksByUserId(id)
            .then((data) => {
                setTasks(data);
            })
            .catch((error) => {
                console.error("Error cargando tareas del usuario:", error.message);
                setTasks([]);
            });
    }, [id]);


    //=========================
    //      Handle Genérico
    //* Función que se ejecuta cada vez que cambia el valor de un input del formulario
    //==========================

    // Manejar cambios
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, userPhoto: Array.from(files) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    //============== HANDLE SUBMIT ==============
    const handleSubmit = async () => {
        setIsSubmitting(true);

        const result = updateUserSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await updateUser(id, result.data);
            console.log("Usuario actualizado:", response);
            navigate(-1);
        } catch (error) {
            console.error("Error:", error.message);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    };

    // =======================================================

    let label;
    // 😂 lógica fuera del JSX
    if (isSubmitting) {
        label = "Actualizando...";
    } else {
        label = "Actualizar";
    };

    const handleTasks = () => {
        if (!selectedTask) {
            alert("Este usuario no tiene tareas para actualizar");
            return;
        }

        setIsTaskModalOpen(true);
    };

    const selectedTask = tasks[0] || null;



    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}
        >
            <Navbar />

            <div className="flex flex-col flex-1 px-10 py-2 gap-4 justify-center">

                {/* Título */}
                <h1 className=" lg:ml-40 " style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0, marginLeft: "64px" }}>
                    Actualizar Cuenta
                </h1>

                {/* Card */}
                <div className="bg-white rounded-2xl flex flex-col gap-6 lg:w-6xl  mx-auto" style={{ padding: "32px 36px" }}>

                    <form
                        onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                        className="
                            flex 
                            flex-col 
                            gap-4 
                            lg:mx-5
                            md:mx-2
                        ">

                        <div
                            className="
                                grid 
                                lg:grid-cols-3 
                                md:grid-cols-2
                                sm:grid-cols-1
                                gap-2
                            ">

                            {/* Fila 1 */}
                            <Input
                                label="Nombre completo"
                                name="userName"
                                placeholder="Ingrese su nombre"
                                type="text"
                                value={formData.userName}
                                onChange={handleChange}
                                error={errors.userName}
                            />
                            <Select
                                label="Tipo de documento"
                                name="userDocumentType"
                                options={documentType}
                                value={formData.userDocumentType}
                                onChange={handleChange}
                                error={errors.userDocumentType}
                            />
                            <Input
                                label="Número de documento"
                                name="userDocumentNumber"
                                placeholder="Ingrese su número de documento"
                                type="text"
                                value={formData.userDocumentNumber}
                                onChange={handleChange}
                                error={errors.userDocumentNumber}
                            />

                            {/* Fila 2 */}
                            <Select
                                label="Grupo"
                                name="groupId"
                                options={groupOptions}   // 👈 igual que en UserRegisterForm
                                value={formData.groupId}
                                onChange={handleChange}
                                error={errors.groupId}
                            />
                            <Input
                                label="Fecha de inicio"
                                name="userStartDate"
                                type="date"
                                value={formData.userStartDate}
                                onChange={handleChange}
                                error={errors.userStartDate}
                            />
                            <Input
                                label="Fecha de finalización"
                                name="userEndDate"
                                type="date"
                                value={formData.userEndDate}
                                onChange={handleChange}
                                error={errors.userEndDate}
                            />

                            {/* Fila 3 */}
                            <Input
                                label="Correo electrónico"
                                name="userEmail"
                                placeholder="Ingrese su correo"
                                type="email"
                                value={formData.userEmail}
                                onChange={handleChange}
                                error={errors.userEmail}
                            />
                            <Input
                                label="Dirección de domicilio"
                                name="userAddress"
                                placeholder="Ingrese su dirección"
                                type="text"
                                value={formData.userAddress}
                                onChange={handleChange}
                                error={errors.userAddress}
                            />
                            <Input
                                label="Número de teléfono"
                                name="userPhone"
                                placeholder="Ingrese su teléfono"
                                type="tel"
                                value={formData.userPhone}
                                onChange={handleChange}
                                error={errors.userPhone}
                            />

                            {/* Fila 4 */}
                            <Select
                                label="Estado"
                                name="userStatus"
                                options={estados}
                                value={formData.userStatus}
                                onChange={handleChange}
                                error={errors.userStatus}
                            />
                            <Input
                                label="Contraseña"
                                name="userPassword"
                                placeholder="Ingrese su contraseña"
                                type="password"
                                value={formData.userPassword}
                                onChange={handleChange}
                                error={errors.userPassword}
                            />
                            <div className="flex flex-row gap-16">
                                <div>
                                    <h4 className="text-[10px]">
                                        Actualizar tarea
                                    </h4>
                                    <Button
                                        type="button"
                                        variant="tertiary"
                                        size="sm"
                                        onClick={handleTasks}
                                    >
                                        Tarea
                                        <Pencil size={20} />
                                    </Button>
                                    {isTaskModalOpen && (
                                        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
                                            <TasksUpdateForm
                                                task={selectedTask}
                                                onClose={() => setIsTaskModalOpen(false)}
                                                onTaskUpdated={(response) => {
                                                    const updatedTask = response.task ?? response;
                                                    setTasks((currentTasks) =>
                                                        currentTasks.map((task) =>
                                                            task.id === updatedTask.id ? updatedTask : task
                                                        )
                                                    );
                                                    setIsTaskModalOpen(false);
                                                }}
                                            />
                                        </div>
                                    )}

                                </div>

                                {/* Contenedor del input */}
                                <div>
                                    <h4>
                                        Foto
                                    </h4>
                                    <FileInput
                                        value={formData.userPhoto}
                                        onChange={(files) =>
                                            setFormData((prev) => ({ ...prev, userPhoto: files }))
                                        }
                                        multiple={true}
                                    />
                                    {errors.userPhoto && (
                                        <span className="text-red-500 text-sm">{errors.userPhoto}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                size="md"
                                onClick={() => navigate(-1)}
                            >
                                Cancelar
                            </Button>
                            <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                                {label}
                                {/* {isSubmitting ? "Guardando..." : "Guardar"} */}
                            </Button>
                        </div>

                    </form>
                    {/* Modal de confirmación */}
                    <Modal
                        isOpen={isModalOpen}
                        title="Confirmar actualización"
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleSubmit}
                        confirmText="Actualizar"
                        cancelText="Cancelar"
                    >
                        <p>¿Seguro que deseas actualizar este usuario?</p>
                    </Modal>
                </div>

            </div>
        </div>
    );
}
