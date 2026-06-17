import { useState, useEffect } from "react";
import { Input, Button, Select, Navbar, FileInput } from "@/shared";
import { getDocumentType } from "../services/selectServices.js";
import { userSchema } from "../schemas/userSchema";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userService.js"

export default function UserRegisterForm() {
    const navigate = useNavigate();

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

    //============== HANDLE SUBMIT ==============
    const handleSubmit = async (e) => {
        // Evita que el formulario recargue la página
        e.preventDefault();

        // Validamos los datos del formulario contra el esquema Zod
        // safeParse NO lanza excepción, retorna un objeto controlado
        const result = userSchema.safeParse(formData);

        // Verificar en consola si el esquema está funcionando 
        console.log(result);

        // Si la validación falla
        if (!result.success) {
            // Objeto donde almacenaremos los errores por campo
            const fieldErrors = {};

            // Recorremos cada error generado por Zod
            result.error.issues.forEach((issue) => {
                // issue.path[0] corresponde al nombre del campo
                // issue.message contiene el mensaje de error definido en el schema
                fieldErrors[issue.path[0]] = issue.message;
            });

            // Actualizamos el estado de errores para mostrarlos en la UI
            setErrors(fieldErrors);

            // Cortamos la ejecución: NO se envía nada al backend

            return;
        }

        // Si la validación pasa, limpiamos errores previos
        setErrors({});

        // Activamos estado de envío (útil para deshabilitar el botón)
        setIsSubmitting(true);

        try {
            // Llamamos al servicio frontend que consume la API
            // result.data contiene los datos ya validados por Zod
            const response = await createUser(result.data);

            // Log informativo para desarrollo
            console.log("Usuario creado:", response);

            // Feedback básico al usuario
            alert("Usuario creado correctamente");

            // Navegamos a la vista anterior
            // navigate(-1) equivale a "volver atrás"
            navigate(-1);
        } catch (error) {
            // Capturamos errores de red o errores lanzados por el service
            console.error("Error:", error.message);

            // Mostramos el mensaje de error al usuario
            alert(error.message);
        } finally {
            // Pase lo que pase, desactivamos el estado de envío
            setIsSubmitting(false);
        }
    };

    // =======================================================

    let label;
    // 😂 lógica fuera del JSX
    if (isSubmitting) {
        label = "Creando...";
    } else {
        label = "Crear";
    }

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}
        >
            <Navbar />

            <div className="flex flex-col flex-1 px-10 py-8 gap-4 justify-center">

                {/* Título */}
                <h1 className=" lg:ml-40 " style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0, marginLeft: "64px" }}>
                    Crear Cuenta
                </h1>

                {/* Card */}
                <div className="bg-white rounded-2xl flex flex-col gap-6 lg:w-6xl  mx-auto" style={{ padding: "32px 36px" }}>

                    <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-gray-500)", margin: 0 }}>
                        Completa los campos para registrar un nuevo usuario
                    </p>

                    <form
                        onSubmit={handleSubmit}
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
                                gap-6
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
                </div>

            </div>
        </div>
    );
}