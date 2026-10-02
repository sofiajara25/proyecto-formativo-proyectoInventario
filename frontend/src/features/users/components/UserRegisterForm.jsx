import { useEffect, useState } from "react";
import { Check, CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, FileInput, Input, Modal, Navbar, Select } from "@/shared";
import { isSuperAdmin } from "@/shared/utils/permissions";
import { getGroups } from "../../access/services/groupService.js";
import { getDocumentType } from "../services/selectServices.js";
import { userSchema } from "../schemas/userSchema";
import { createUser } from "../services/userService.js";
import { showAlert, showSuccessAndThen } from "@/shared/utils/alertBus";
import { useFormExitGuard } from "@/shared/hooks/useFormExitGuard";

export default function UserRegisterForm() {
    const navigate = useNavigate();
    const canEditSuperAdmin = isSuperAdmin();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dataConsentAccepted, setDataConsentAccepted] = useState(false);
    const [consentChecked, setConsentChecked] = useState(false);
    const [consentModalError, setConsentModalError] = useState("");
    const [documentType, setDocumentType] = useState([]);
    const [groups, setGroups] = useState([]);
    const [errors, setErrors] = useState({});
    const [validatedUserData, setValidatedUserData] = useState(null);

    const [formData, setFormData] = useState({
        userName: "",
        userLastname: "",
        userDocumentType: "",
        userDocumentNumber: "",
        groupId: "",
        userStartDate: "",
        userEndDate: "",
        userEmail: "",
        userAddress: "",
        userPhone: "",
        userStatus: "",
        userPhoto: null,
        isSuperAdmin: false,
    });

    // Pregunta antes de salir si ya hay datos ingresados (botón Cancelar
    // del formulario y Cancelar de la ventana de confirmación).
    const { requestExit, exitModal } = useFormExitGuard(formData, () => navigate(-1));

    const today = new Date();
    const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const estados = [
        { value: "", label: "Selecciona tu opcion" },
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" },
    ];

    const groupOptions = [
        { value: "", label: "Selecciona tu opcion" },
        ...groups.map((group) => ({
            value: String(group.group_id),
            label: group.group_name,
        })),
    ];

    useEffect(() => {
        getDocumentType().then(setDocumentType);
        getGroups().then(setGroups).catch((error) => console.error(error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSuperAdminChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            isSuperAdmin: e.target.checked,
        }));
    };

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

    const validateForm = () => {
        const result = userSchema.safeParse({
            ...formData,
            groupId: String(formData.groupId),
            userAddress: formData.userAddress || "",
            userPhone: formData.userPhone || "",
            userPhoto: formData.userPhoto || undefined,
        });

        const fieldErrors = {};
        if (!result.success) {
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
        }

        if (!dataConsentAccepted) {
            fieldErrors.dataConsent = "Debes autorizar el tratamiento de datos personales para crear el usuario.";
        }

        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return null;
        }

        setErrors({});
        return result.data;
    };

    const handleOpenCreateModal = (e) => {
        e.preventDefault();
        const validData = validateForm();
        if (!validData) return;

        setValidatedUserData(validData);
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        const userData = validatedUserData ?? validateForm();
        if (!userData) return;

        setIsSubmitting(true);
        try {
            await createUser(userData);
            showSuccessAndThen("Usuario creado con éxito", () => navigate(-1));
        } catch (error) {
            console.error("Error:", error.message);
            showAlert(error.message, { type: "error" });
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    };

    const label = isSubmitting ? "Creando..." : "Crear";

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}
        >
            <Navbar />

            <div className="flex flex-col flex-1 px-10 gap-1 justify-center">
                <div className="w-full lg:max-w-6xl mx-auto flex flex-col gap-1">
                    <h1 style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0 }}>
                        Crear Cuenta
                    </h1>

                    <div className="bg-white rounded-2xl flex flex-col gap-1 w-full" style={{ padding: "10px" }}>
                        <form
                            onSubmit={handleOpenCreateModal}
                            className="flex flex-col gap-2 lg:mx-5 md:mx-2"
                        >
                            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2">
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
                                    label={<span>Numero de documento <span style={{ color: "red" }}>*</span></span>}
                                    name="userDocumentNumber"
                                    placeholder="Ingrese su numero de documento"
                                    type="text"
                                    value={formData.userDocumentNumber}
                                    onChange={handleChange}
                                    error={errors.userDocumentNumber}
                                />
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
                                    min={localToday}
                                />
                                <Input
                                    label={<span>Fecha de finalizacion <span style={{ color: "red" }}>*</span></span>}
                                    name="userEndDate"
                                    type="date"
                                    value={formData.userEndDate}
                                    onChange={handleChange}
                                    error={errors.userEndDate}
                                    min={localToday}
                                />
                                <Input
                                    label={<span>Correo electronico <span style={{ color: "red" }}>*</span></span>}
                                    name="userEmail"
                                    placeholder="Ingrese su correo"
                                    type="email"
                                    value={formData.userEmail}
                                    onChange={handleChange}
                                    error={errors.userEmail}
                                />
                                <Input
                                    label="Direccion de domicilio"
                                    name="userAddress"
                                    placeholder="Ingrese su direccion"
                                    type="text"
                                    value={formData.userAddress}
                                    onChange={handleChange}
                                    error={errors.userAddress}
                                />
                                <Input
                                    label="Numero de telefono"
                                    name="userPhone"
                                    placeholder="Ingrese su telefono"
                                    type="tel"
                                    value={formData.userPhone}
                                    onChange={handleChange}
                                    error={errors.userPhone}
                                />
                                <Select
                                    label={<span>Estado <span style={{ color: "red" }}>*</span></span>}
                                    name="userStatus"
                                    options={estados}
                                    value={formData.userStatus}
                                    onChange={handleChange}
                                    error={errors.userStatus}
                                />
                                {/* Antes aquí había un campo "Contraseña" desactivado que no
                                    hacía nada (la contraseña la genera el backend). En su
                                    lugar va la autorización de datos y un aviso. */}
                                <div className="w-full max-w-[320px] flex flex-col gap-1">
                                    <h4 className="text-[10px]">Tratamiento de datos personales</h4>
                                    <Button
                                        type="button"
                                        variant="tertiary"
                                        size="sm"
                                        onClick={handleOpenConsentModal}
                                    >
                                        {dataConsentAccepted ? "Autorizacion registrada" : "Autorizacion de datos"}
                                        {dataConsentAccepted ? <Check /> : <CirclePlus />}
                                    </Button>
                                    {errors.dataConsent && (
                                        <p className="text-caption text-red-800 place-self-start">
                                            {errors.dataConsent}
                                        </p>
                                    )}
                                </div>

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
                                            Unico que puede administrar Grupos y Permisos.
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-row gap-16">
                                    <div>
                                        <h4>Foto</h4>
                                        <FileInput
                                            value={formData.userPhoto ? [formData.userPhoto] : []}
                                            onChange={(files) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    userPhoto: files[0] || null,
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

                            {/* El aviso de la contraseña va en la misma fila de los
                                botones (a la izquierda) para no sumar altura al
                                formulario y que no aparezca scroll. */}
                            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                                <p className="text-caption text-gray-500 sm:max-w-[60%]">
                                    La contraseña se genera automáticamente y nadie la puede ver. Para
                                    ingresar por primera vez, el usuario debe usar "¿Olvidaste tu
                                    contraseña?" en el inicio de sesión y crear la suya.
                                </p>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="md"
                                        onClick={() => requestExit()}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                                        {label}
                                    </Button>
                                </div>
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
                                De acuerdo con La Ley 1581 de 2012, Proteccion de Datos Personales, el Servicio
                                Nacional de Aprendizaje SENA, se compromete a garantizar la seguridad y proteccion
                                de los datos personales que se encuentran almacenados en este documento, y les dara
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

                        {exitModal}
                        <Modal
                            isOpen={isModalOpen}
                            title="Confirmar creacion de usuario"
                            onClose={() => {
                // Cancelar la confirmación también pregunta si de verdad
                // quiere salir, porque ya hay datos ingresados.
                setIsModalOpen(false);
                requestExit({ always: true });
            }}
                            onConfirm={handleSubmit}
                            confirmText="Crear"
                            cancelText="Cancelar"
                        >
                            <p>Seguro que deseas crear este usuario?</p>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
}

