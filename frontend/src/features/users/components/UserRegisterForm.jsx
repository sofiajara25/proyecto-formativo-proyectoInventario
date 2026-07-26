import { useState, useEffect } from "react";
import { Input, Button, Select, Navbar, FileInput, Modal } from "@/shared";
import { getDocumentType } from "../services/selectServices.js";
import { userSchema } from "../schemas/userSchema";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userService.js";
import { CirclePlus } from "lucide-react"
import { TasksRegisterForm } from "@/features/tasks"
import { createTask } from "../../tasks/services/taskService.js";


export default function UserRegisterForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [isTaskOpen, setIsTaskOpen] = useState(false);

    const [pendingUserData, setPendingUserData] = useState(null);
    const [pendingTaskData, setPendingTaskData] = useState(null);


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [documentType, setDocumentType] = useState([]);
    const [formData, setFormData] = useState({
        userName: "",
        userDocumentType: "",
        userDocumentNumber: "",
        userType: "",
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

    const tiposUsuario = [
        { value: "admin", label: "Administrador" },
        { value: "usuario", label: "Usuario" },
    ];

    const estados = [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
    ];

    useEffect(() => {
        getDocumentType().then(setDocumentType);
    }, []);

    const validateUserForm = () => {
        const result = userSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            return null;
        }

        setErrors({});
        return result.data;
    };

    //=========================
    //      Handle Genérico
    //* Función que se ejecuta cada vez que cambia el valor de un input del formulario
    //==========================

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleOpenTask = (e) => {
        e.preventDefault();
        const result = userSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }
        setErrors({});
        setPendingUserData(result.data); // ✅ solo guardar en memoria
        setIsTaskOpen(true);             // abrir modal de tarea
    };


    const handleCreateAll = async () => {
        setIsSubmitting(true);
        setIsModalOpen(false);

        try {
            if (!pendingUserData) {
                throw new Error("No hay datos de usuario validados en memoria");
            }

            // Crear usuario en backend
            const userResponse = await createUser(pendingUserData);
            const userId = userResponse.id ?? userResponse.userId;

            if (!userId) {
                throw new Error("El backend no devolvió el id del usuario creado");
            }

            // Crear tarea vinculada al usuario (ahora sí en BD)
            if (pendingTaskData) {
                await createTask({ ...pendingTaskData, userId });
            }

            navigate(-1);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleSubmitWithModal = (e) => {
        e.preventDefault();
        const validUserData = validateUserForm();
        if (!validUserData) return;

        if (!pendingTaskData) {
            alert("Debes asignar una tarea antes de crear el usuario");
            return;
        }

        setPendingUserData(validUserData); // guardar usuario validado
        setIsModalOpen(true);              // abrir modal de confirmación
    };



    // =======================================================

    let label;
    // 😂 lógica fuera del JSX
    if (isSubmitting) {
        label = "Creando...";
    } else {
        label = "Crear";
    };

    // Acción para ver el préstamo
    // const handleTasks = () => {
    //     navigate(`/dashboard/users/tasks`);
    // };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}
        >
            <Navbar />

            <div className="flex flex-col flex-1 px-10 py-1 gap-2 justify-center">

                {/* Título */}
                <h1 className=" lg:ml-40 " style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0, marginLeft: "64px" }}>
                    Crear Cuenta
                </h1>

                {/* Card */}
                <div className="bg-white rounded-2xl flex flex-col gap-2 lg:w-6xl  mx-auto" style={{ padding: "14px" }}>

                    <form
                        onSubmit={handleSubmitWithModal}
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
                                    gap-4
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
                                label="Tipo de usuario"
                                name="userType"
                                options={tiposUsuario}
                                value={formData.userType}
                                onChange={handleChange}
                                error={errors.userType}
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
                                        Asignar tarea
                                    </h4>
                                    <Button
                                        type="button"
                                        variant="tertiary"
                                        size="sm"
                                        onClick={handleOpenTask}
                                    >
                                        Tarea
                                        <CirclePlus />
                                    </Button>
                                    {/* Mostrar TaskForm encima */}
                                    {isTaskOpen && (
                                        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
                                            <TasksRegisterForm
                                                onClose={() => setIsTaskOpen(false)}
                                                onSaveTask={(taskData) => {
                                                    setPendingTaskData(taskData); // ✅ solo guardar en memoria
                                                    setIsTaskOpen(false);         // cerrar modal
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

                            <Button variant="primary" size="md" type="submit"
                                disabled={isSubmitting} >
                                {label}
                                {/* {isSubmitting ? "Guardando..." : "Guardar"} */}
                            </Button>

                        </div>

                    </form>
                    <Modal
                        isOpen={isModalOpen}
                        title="Confirmar creación de usuario"
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleCreateAll}
                        confirmText="Crear"
                        cancelText="Cancelar"
                    >
                        <p>¿Seguro que deseas crear este usuario?</p>
                    </Modal>

                </div>

            </div>
        </div>
    );
}
