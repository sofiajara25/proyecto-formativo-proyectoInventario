import { useState, useEffect } from "react";
import { Input, Button, Select, Navbar, FileInput, Modal } from "@/shared";
import { getDocumentType } from "../services/selectServices.js";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../services/userService";
import { getGroups } from "../../access/services/groupService.js";
import { updateUserSchema } from "../schemas/updateUserSchema.js";


export default function UserUpdateForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [documentType, setDocumentType] = useState([]);
    const [formData, setFormData] = useState({
        userName: "",
        userLastname: "",
        userDocumentType: "",
        userDocumentNumber: "",
        groupId: "",
        userEndDate: "",
        userStartDate: "",
        userEmail: "",
        userAddress: "",
        userPhone: "",
        userStatus: "",
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
                userLastname: data.user_lastname || "",
                userDocumentType: data.document_type || "",
                userDocumentNumber: data.document_number || "",
                groupId: data.group_id ? String(data.group_id) : "",
                userStartDate: data.start_date?.slice(0, 10) || "",
                userEndDate: data.end_date?.slice(0, 10) || "",
                userEmail: data.user_email || "",
                userAddress: data.user_address || "",
                userPhone: data.user_phone || "",
                userStatus: data.user_status || "",
                // Precargamos la foto ya guardada para que se vea en el
                // formulario y el usuario sepa qué va a reemplazar. Si no
                // toca el campo, se conserva tal cual.
                userPhoto: data.photo_url ? [data.photo_url] : [],
            });
        });
    }, [id]);
    useEffect(() => {
        getDocumentType().then(setDocumentType);
    }, []);

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

        // 🔹 Normalizar y convertir datos antes de validar
        // groupId se deja como string: así lo espera el schema (updateUserSchema.groupId
        // es z.string()) y así viaja igual en el FormData que arma updateUser().
        const parsedData = {
            ...formData,
            userPhone: String(formData.userPhone), // asegurar tipo string
        };

        // 🔹 Validación con Zod
        const result = updateUserSchema.safeParse(parsedData);
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
            // 🔹 Actualizar usuario en backend
            const response = await updateUser(id, result.data);
            console.log("Usuario actualizado:", response);

            // 🔹 Redirigir al listado
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

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}
        >
            <Navbar />

            <div className="flex flex-col flex-1 px-10 py-1 gap-1 justify-center">

                {/* Título y tarjeta comparten el mismo ancho máximo y quedan
                            centrados juntos, así el título siempre queda a la par
                            del borde izquierdo de la tarjeta sin importar el
                            tamaño de pantalla. */}
                <div className="w-full lg:max-w-6xl mx-auto flex flex-col gap-1">
                    {/* Título */}
                    <h1 style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0 }}>
                        Actualizar Cuenta
                    </h1>

                    {/* Card */}
                    <div className="bg-white rounded-2xl flex flex-col gap-1 w-full" style={{ padding: "14px" }}>

                        <form
                            onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                            className="
                                        flex 
                                        flex-col 
                                        gap-2
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
                                    label={<span>Nombres <span style={{ color: "red" }}>*</span></span>}
                                    name="userName"
                                    placeholder="Ingrese su nombre"
                                    type="text"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    error={errors.userName}
                                />
                                <Input
                                    label={<span>Apellidos <span style={{ color: "red" }}>*</span></span>}
                                    name="userLastname"
                                    placeholder="Ingrese su apellido"
                                    type="text"
                                    value={formData.userLastname}
                                    onChange={handleChange}
                                    error={errors.userLastname}
                                />
                                <Select
                                    label={<span>Tipo de documento <span style={{ color: "red" }}>*</span></span>}
                                    name="userDocumentType"
                                    options={documentType}
                                    value={formData.userDocumentType}
                                    onChange={handleChange}
                                    error={errors.userDocumentType}
                                />
                                <Input
                                    label={<span>Número de documento <span style={{ color: "red" }}>*</span></span>}
                                    name="userDocumentNumber"
                                    placeholder="Ingrese su número de documento"
                                    type="text"
                                    value={formData.userDocumentNumber}
                                    onChange={handleChange}
                                    error={errors.userDocumentNumber}
                                />

                                {/* Fila 2 */}
                                <Select
                                    label={<span>Grupo <span style={{ color: "red" }}>*</span></span>}
                                    name="groupId"
                                    options={groupOptions}
                                    value={formData.groupId}
                                    onChange={handleChange}
                                    error={errors.groupId}
                                />

                                <Input
                                    label={<span>Fecha de inicio <span style={{ color: "red" }}>*</span></span>}
                                    name="userStartDate"
                                    type="date"
                                    value={formData.userStartDate}
                                    onChange={handleChange}
                                    error={errors.userStartDate}
                                    // Sin "min": esto es el formulario de ACTUALIZAR, y un
                                    // registro existente puede tener una fecha de inicio
                                    // anterior a hoy sin que el usuario la esté cambiando.
                                    // El "min" nativo del navegador bloquea el envío por
                                    // completo (sin ningún error visible) si la fecha ya
                                    // guardada queda antes de hoy.
                                />

                                <Input
                                    label={<span>Fecha de finalización <span style={{ color: "red" }}>*</span></span>}
                                    name="userEndDate"
                                    type="date"
                                    value={formData.userEndDate}
                                    onChange={handleChange}
                                    error={errors.userEndDate}
                                />
                                {/* Fila 3 */}
                                <Input
                                    label={<span>Correo electrónico <span style={{ color: "red" }}>*</span></span>}
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
                                    label={<span>Esatdo<span style={{ color: "red" }}>*</span></span>}
                                    name="userStatus"
                                    options={estados}
                                    value={formData.userStatus}
                                    onChange={handleChange}
                                    error={errors.userStatus}
                                />
                                {/* Se muestra en gris, sin valor: la contraseña se
                                    generó sola al crear el usuario y no se
                                    puede ver ni cambiar desde aquí. */}
                                <Input
                                    label="Contraseña"
                                    name="userPasswordDisplay"
                                    placeholder="Esta contraseña no se puede cambiar"
                                    type="password"
                                    value=""
                                    disabled
                                    readOnly
                                />

                                <div className="flex flex-row gap-16">

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
                                            multiple={false}
                                        />
                                        {errors.userPhoto && (
                                            <span className="text-red-500 text-sm">{errors.userPhoto}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex justify-end gap-3 pt-1">
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
                            title="Confirmar actualización de usuario"
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
        </div>
    );
}
