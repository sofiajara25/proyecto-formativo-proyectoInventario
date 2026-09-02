import { useState, useEffect } from "react";
import { Input, Button, Select, Navbar, FileInput, Modal, Checkbox } from "@/shared";
import { getDocumentType } from "../services/selectServices.js";
import { userSchema } from "../schemas/userSchema";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userService.js";
import { CirclePlus, Check } from "lucide-react"
import { getGroups } from "../../access/services/groupService.js";
import { isSuperAdmin } from "@/shared/utils/permissions";

export default function UserRegisterForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    // Solo un Super Administrador puede marcar a otro usuario como tal;
    // el backend lo vuelve a validar igual, esto es solo para no mostrar
    // un control que de todos modos no va a surtir efecto.
    const canEditSuperAdmin = isSuperAdmin();
    // El consentimiento se pide de nuevo por cada usuario nuevo que se
    // registre: no se recuerda de un usuario a otro (no usa localStorage),
    // así que siempre arranca en false.
    const [dataConsentAccepted, setDataConsentAccepted] = useState(false);
    const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
    const [consentChecked, setConsentChecked] = useState(false);
    const [consentModalError, setConsentModalError] = useState("");

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
        userPhoto: null,
        isSuperAdmin: false,
    });
    const [errors, setErrors] = useState({});

    const [groups, setGroups] = useState([]);

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const localToday = `${yyyy}-${mm}-${dd}`;


    const estados = [
        { value: "", label: "Selecciona tu opción" },
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" },
    ];

    const groupOptions = [
        { value: "", label: "Selecciona tu opción" }, // opción fija
        ...groups.map((g) => ({
            value: g.group_id,
            label: g.group_name,
        })),
    ];

    useEffect(() => {
        getDocumentType().then(setDocumentType);
        getGroups().then(setGroups).catch(err => console.error(err));
    }, []);

    const handleOpenConsentModal = () => {
        setConsentChecked(dataConsentAccepted);
        setConsentModalError("");
        setIsConsentModalOpen(true);
    };

    const handleCloseConsentModal = () => {
        setIsConsentModalOpen(false);
        setConsentModalError("");
    };

    const handleConfirmConsent = () => {
        if (!consentChecked) {
            setConsentModalError('Debes marcar "Autorizo" para continuar.');
            return;
        }
        setDataConsentAccepted(true);
        setErrors((prev) => ({ ...prev, dataConsent: undefined }));
        setIsConsentModalOpen(false);
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

    // El checkbox de Super Administrador manda checked, no value.
    const handleSuperAdminChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            isSuperAdmin: e.target.checked,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // 🔹 Normalizar y convertir datos antes de validar
        const parsedData = {
            ...formData,
            groupId: Number(formData.groupId), // convertir a número si es id
            userPhone: String(formData.userPhone), // asegurar tipo string
        };

        // 🔹 Validación con Zod
        const result = userSchema.safeParse(parsedData);
        const fieldErrors = {};
        if (!result.success) {
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
        }

        // El tratamiento de datos personales es obligatorio para ESTE
        // usuario en particular: si no se marcó "Autorizo", no se deja
        // crear, sin importar que se haya autorizado en un usuario anterior.
        if (!dataConsentAccepted) {
            fieldErrors.dataConsent = "Debes autorizar el tratamiento de datos personales para crear el usuario.";
        }

        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        setErrors({});
        try {
            // 🔹 Crear usuario en backend
            const response = await createUser(result.data);
            console.log("Usuario creado:", response);

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

            <div className="flex flex-col flex-1 px-10 py-1 gap-1 justify-center">

                {/* Título y tarjeta comparten el mismo ancho máximo y quedan
                    centrados juntos, así el título siempre queda a la par
                    del borde izquierdo de la tarjeta sin importar el
                    tamaño de pantalla. */}
                <div className="w-full lg:max-w-6xl mx-auto flex flex-col gap-1">
                    {/* Título */}
                    <h1 style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0 }}>
                        Crear Cuenta
                    </h1>

                    {/* Card */}
                    <div className="bg-white rounded-2xl flex flex-col gap-1 w-full" style={{ padding: "14px" }}>

                        <form
                            onSubmit={handleSubmit}
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
                                    min={localToday} // 👈 ahora sí permite hoy
                                />

                                <Input
                                    label={<span>Fecha de finalización <span style={{ color: "red" }}>*</span></span>}
                                    name="userEndDate"
                                    type="date"
                                    value={formData.userEndDate}
                                    onChange={handleChange}
                                    error={errors.userEndDate}
                                    min={localToday}
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
                                genera sola en el backend al crear el usuario
                                y no hay forma de verla, ni siquiera aquí. */}
                                <Input
                                    label="Contraseña"
                                    name="userPasswordDisplay"
                                    placeholder="Se genera automáticamente"
                                    type="password"
                                    value=""
                                    disabled
                                    readOnly
                                />

                                {/* Super Administrador: el único que puede entrar a
                                    Grupos y Permisos y decidir quién tiene qué
                                    permiso. No reemplaza el grupo ni los permisos
                                    normales del usuario. Solo otro Super
                                    Administrador puede marcar esta casilla. */}
                                {canEditSuperAdmin && (
                                    <div className="flex flex-col gap-1 justify-center">
                                        <Checkbox
                                            id="isSuperAdmin"
                                            name="isSuperAdmin"
                                            label="Super Administrador"
                                            checked={formData.isSuperAdmin}
                                            onChange={handleSuperAdminChange}
                                        />
                                        <p className="text-caption text-gray-500">
                                            Único que puede administrar Grupos y Permisos.
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-row gap-16">

                                    {/* Contenedor del input */}
                                    <div>
                                        <h4>
                                            Foto
                                        </h4>
                                        <FileInput
                                            value={formData.userPhoto ? [formData.userPhoto] : []} // 👈 guardamos como array de 1
                                            onChange={(files) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    userPhoto: files[0] || null // 👈 solo el primer archivo
                                                }))
                                            }
                                            multiple={false}
                                        />
                                        {errors.userPhoto && (
                                            <span className="text-red-500 text-sm">{errors.userPhoto}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Tratamiento de datos personales */}
                            <div className="pt-1">
                                <h4 className="text-[10px]">
                                    Tratamiento de datos personales
                                </h4>
                                <Button
                                    type="button"
                                    variant="tertiary"
                                    size="sm"
                                    onClick={handleOpenConsentModal}
                                >
                                    {dataConsentAccepted ? "Autorización registrada" : "Autorización de datos"}
                                    {dataConsentAccepted ? <Check /> : <CirclePlus />}
                                </Button>
                                {errors.dataConsent && (
                                    <p className="text-caption text-red-800 place-self-start">
                                        {errors.dataConsent}
                                    </p>
                                )}
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
                            isOpen={isConsentModalOpen}
                            title="Tratamiento de datos personales"
                            onClose={handleCloseConsentModal}
                            onConfirm={handleConfirmConsent}
                            confirmText="Guardar"
                            cancelText="Cancelar"
                        >
                            <p className="text-sm text-text-primary mb-4">
                                De acuerdo con La Ley 1581 de 2012, Protección de Datos Personales, el Servicio
                                Nacional de Aprendizaje SENA, se compromete a garantizar la seguridad y protección
                                de los datos personales que se encuentran almacenados en este documento, y les dará
                                el tratamiento correspondiente en cumplimiento de lo establecido legalmente.
                            </p>
                            <Checkbox
                                id="dataConsent"
                                name="dataConsent"
                                label="Autorizo"
                                checked={consentChecked}
                                onChange={(e) => setConsentChecked(e.target.checked)}
                            />
                            {consentModalError && (
                                <p className="text-caption text-red-800 place-self-start mt-2">
                                    {consentModalError}
                                </p>
                            )}
                        </Modal>

                        <Modal
                            isOpen={isModalOpen}
                            title="Confirmar creación de usuario"
                            onClose={() => setIsModalOpen(false)}
                            onConfirm={handleSubmit}
                            confirmText="Crear"
                            cancelText="Cancelar"
                        >
                            <p>¿Seguro que deseas crear este usuario?</p>
                        </Modal>

                    </div>
                </div>

            </div>
        </div>
    );
}
