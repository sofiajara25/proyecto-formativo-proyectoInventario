import { useState, useEffect } from "react";
import { Input, Button, Select, Navbar, FileInput, IconButton, Modal } from "@/shared";
import { loanSchema } from "../schemas/loansSchema.js";
import { createLoan } from "../services/loanService.js";
import { getUsers } from "../../users/services/userService.js";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

function crearMaterialVacio() {
    return {
        id: crypto.randomUUID(),
        materialId: "",
        loanCategory: "",
        loanProductName: "",
        loanQuantity: 1,
    };
}

export default function LoansRegisterForm() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        loanMaterialType: "",
        loanUser: "",
        loanUserIdentification: "",
        loanApprenticeGroup: "",
        materials: [crearMaterialVacio()],
        loanDate: "",
        loanReturnDate: "",
        loanDescription: "",
        // Arranca sin elegir ("") para que se vea "Seleccione una opción" al
        // entrar al formulario, en vez de aparecer "Activo" ya escogido sin
        // que el usuario lo haya tocado.
        isActive: "",
        loanType: "",
        photo: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errors, setErrors] = useState({});

    // Listas reales de materiales (para el select de "Nombre del producto").
    // Cuál de las dos se usa depende de "loanMaterialType": un préstamo
    // Devolutivo descuenta de material devolutivo, uno de Consumo del de
    // consumo. Así evitamos que se escriba un nombre que no existe, o que
    // se ponga como Devolutivo un material que en realidad es de Consumo.
    const [returnableMaterials, setReturnableMaterials] = useState([]);
    const [consumableMaterials, setConsumableMaterials] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/returnableMaterial")
            .then((res) => res.json())
            .then(setReturnableMaterials)
            .catch((err) => console.error("Error cargando materiales devolutivos:", err));

        fetch("http://localhost:5000/api/consumableMaterial")
            .then((res) => res.json())
            .then(setConsumableMaterials)
            .catch((err) => console.error("Error cargando materiales de consumo:", err));
    }, []);

    // Usuarios registrados en el sistema, para poder buscarlos y no tener
    // que ir a "Usuarios" a copiar el número de documento a mano.
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch((err) => console.error("Error cargando usuarios:", err));
    }, []);

    // Mismo campo "Usuarios" de siempre, pero con autocompletado (datalist):
    // al escribir, el navegador sugiere los usuarios registrados; si el
    // nombre escrito coincide exactamente con uno de la lista, se completa
    // solo el número de documento. Si no coincide (usuario no registrado),
    // el campo de identificación queda libre para escribir el correo.
    const handleLoanUserChange = (e) => {
        const { value } = e.target;
        const chosen = users.find((u) => `${u.user_name} ${u.user_lastname}` === value);
        setFormData((prev) => ({
            ...prev,
            loanUser: value,
            loanUserIdentification: chosen ? chosen.document_number : prev.loanUserIdentification,
        }));
    };

    // Materiales disponibles para el tipo de préstamo elegido.
    const materialsForType =
        formData.loanMaterialType === "Devolutivo"
            ? returnableMaterials
            : formData.loanMaterialType === "Consumo"
                ? consumableMaterials
                : [];

    const productOptions = [
        { value: "", label: "Selecciona un material" },
        ...materialsForType.map((m) => ({
            value: String(m.id),
            label: `${m.material_name} (disponible: ${m.quantity})`,
        })),
    ];

    // Si cambia el tipo de préstamo, la lista de materiales disponibles
    // cambia por completo: limpiamos las selecciones para no dejar un
    // materialId de la tabla equivocada colgado en algún renglón. Esto se
    // hace directamente en el onChange del select (no en un useEffect) para
    // que sea un solo cambio de estado, sin renders de más.
    const handleMaterialTypeChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            loanMaterialType: value,
            materials: prev.materials.map((m) => ({ ...m, materialId: "", loanProductName: "" })),
        }));
    };

    const handleProductSelect = (rowId, selectedId) => {
        const chosen = materialsForType.find((m) => String(m.id) === String(selectedId));
        setFormData((prev) => ({
            ...prev,
            materials: prev.materials.map((m) =>
                m.id === rowId
                    ? { ...m, materialId: selectedId, loanProductName: chosen?.material_name ?? "" }
                    : m
            ),
        }));
    };

    // Fecha de hoy en formato YYYY-MM-DD usando la zona horaria local
    // (evita el corrimiento de un día que da new Date().toISOString()).
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const localToday = `${yyyy}-${mm}-${dd}`;

    const tipoMaterial = [
        { value: "", label: "Seleccione una opcion" },
        { value: "Devolutivo", label: "Devolutivo" },
        { value: "Consumo", label: "Consumo" },
    ]

    const categorias = [
        { value: "", label: "Seleccione una opcion" },
        { value: "herramienta", label: "Herramienta" },
        { value: "equipo", label: "Equipo" },
        { value: "consumible", label: "Consumible" },
    ];

    const tipoPrestamo = [
        { value: "", label: "Seleccione una opcion" },
        { value: "interno", label: "Interno" },
        { value: "externo.", label: "Externo." },
    ]

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleAddMaterial = () => {
        setFormData((prev) => ({
            ...prev,
            materials: [...prev.materials, crearMaterialVacio()],
        }));
    };

    const handleRemoveMaterial = (id) => {
        setFormData((prev) => ({
            ...prev,
            materials: prev.materials.filter((m) => m.id !== id),
        }));
    };

    const handleMaterialChange = (id, field, value) => {
        setFormData((prev) => ({
            ...prev,
            materials: prev.materials.map((m) =>
                m.id === id ? { ...m, [field]: value } : m
            ),
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Todo el flujo queda envuelto en un try/catch: así, si algo revienta
        // de forma inesperada (un error que no contemplamos), igual se avisa
        // con una alerta y se cierra el modal, en vez de quedar "colgado"
        // sin ningún mensaje.
        try {
            // Validación con Zod
            const result = loanSchema.safeParse(formData);

            if (!result.success) {
                const fieldErrors = {};
                result.error.issues.forEach((issue) => {
                    // Ej. ["materials", 0, "loanCategory"] -> "materials.0.loanCategory",
                    // así calzan con las claves que usa el render para mostrar el
                    // error de cada material individual.
                    const field = issue.path.join(".");
                    fieldErrors[field] = issue.message;
                });
                setErrors(fieldErrors);
                console.warn("Errores de validación al crear el préstamo:", fieldErrors);
                alert(
                    "Revisa el formulario, hay campos con error:\n" +
                        Object.entries(fieldErrors).map(([field, msg]) => `- ${field}: ${msg}`).join("\n")
                );
                return;
            }

            setErrors({});

            if (!formData.materials.length) {
                setErrors({ materials: "Debe agregar al menos un material" });
                alert("Debe agregar al menos un material.");
                return;
            }

            const payload = {
                ...result.data,
                materials: formData.materials.map(({ materialId, loanCategory, loanProductName, loanQuantity }) => ({
                    materialId,
                    loanCategory,
                    loanProductName,
                    loanQuantity: Number(loanQuantity),
                })),
                photo: formData.photo,
            };

            const response = await createLoan(payload);

            console.log("Préstamo creado:", response);
            // Volver atrás
            window.history.back();
        } catch (error) {
            console.error("Error creando préstamo:", error);
            alert(error?.message || "Ocurrió un error inesperado al crear el préstamo.");
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    };

    let label;
    // 😂 lógica fuera del JSX
    if (isSubmitting) {
        label = "Creando...";
    } else {
        label = "Crear prestamo";
    }



    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}
        >
            <Navbar />

            <div className="flex flex-col flex-1 px-4 sm:px-6 lg:px-10 py-4 gap-1 justify-center">

                {/* Título */}
                <h1 className="lg:pl-[70px]"
                    style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0, }}>
                    Crear Préstamo
                </h1>

                {/* Card */}
                <div className="bg-white rounded-2xl flex flex-col gap-6 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:px-9 lg:py-[18px]">

                    <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="grid grid-cols-1  gap-2">

                        <div
                            className="grid gap-3 items-start
                            lg:grid-cols-[1fr_1fr_1fr_56px]
                            md:grid-cols-2
                            grid-cols-1"
                        >
                            <Select
                                label={<span>Tipo de Material <span style={{ color: "red" }}>*</span></span>}
                                name="loanMaterialType"
                                options={tipoMaterial}
                                value={formData.loanMaterialType}
                                onChange={handleMaterialTypeChange}
                                error={errors.loanMaterialType}
                            />

                            {/* Mismo campo de siempre: si el nombre escrito coincide con
                                un usuario registrado (sugerido por el navegador vía
                                datalist), se autocompleta su documento abajo. Si no
                                coincide, se asume que no está registrado. */}
                            <Input
                                label={<span>Usuarios<span style={{ color: "red" }}>*</span></span>}
                                name="loanUser"
                                placeholder="Nombre del solicitante"
                                type="text"
                                list="registered-users-list"
                                value={formData.loanUser}
                                onChange={handleLoanUserChange}
                                error={errors.loanUser}
                            />
                            <datalist id="registered-users-list">
                                {users.map((u) => (
                                    <option key={u.id} value={`${u.user_name} ${u.user_lastname}`} />
                                ))}
                            </datalist>

                            <Input
                                label={<span>Identificación del Usuario<span style={{ color: "red" }}>*</span></span>}
                                name="loanUserIdentification"
                                // Si el solicitante está registrado, es su número de
                                // documento (se autocompleta arriba). Si no está
                                // registrado, aquí va su correo electrónico.
                                placeholder="N° de documento o correo si no está registrado"
                                type="text"
                                value={formData.loanUserIdentification}
                                onChange={handleChange}
                                error={errors.loanUserIdentification}
                                // En tablet (2 columnas) este es el campo "sobrante" del
                                // grupo de 3: en vez de quedar solo y angosto (320px) con
                                // un vacío enorme al lado, ocupa las dos columnas. En
                                // escritorio (3-4 columnas) vuelve a ser una más del grupo.
                                containerClassName="md:col-span-2 md:max-w-full lg:col-span-1 lg:max-w-[320px]"
                            />

                        </div>
                        <div
                            className="grid gap-3 items-start
                            lg:grid-cols-[1fr_1fr_1fr_56px]
                            md:grid-cols-2
                            grid-cols-1"
                        >
                            <Input
                                label="Grupo de Aprendices"
                                name="loanApprenticeGroup"
                                placeholder="Ingrese el grupo de aprendices"
                                type="text"
                                value={formData.loanApprenticeGroup}
                                onChange={handleChange}
                                error={errors.loanApprenticeGroup}
                            />
                            <Input
                                label={<span>Fecha prestamos<span style={{ color: "red" }}>*</span></span>}
                                name="loanDate"
                                type="date"
                                value={formData.loanDate}
                                onChange={handleChange}
                                error={errors.loanDate}
                                min={localToday}
                            />

                            <Input
                                label={<span>Fecha devolucion <span style={{ color: "red" }}>*</span></span>}
                                name="loanReturnDate"
                                type="date"
                                value={formData.loanReturnDate}
                                onChange={handleChange}
                                error={errors.loanReturnDate}
                                min={formData.loanDate || localToday}
                                containerClassName="md:col-span-2 md:max-w-full lg:col-span-1 lg:max-w-[320px]"
                            />

                        </div>

                        {/* Materiales del préstamo */}
                        <div className="w-full flex flex-col gap-3">

                            {errors.materials && (
                                <span className="text-red-500 text-sm">{errors.materials}</span>
                            )}

                            {formData.materials.map((material, index) => (
                                <div
                                    key={material.id}
                                    className="grid gap-3 items-start bg-neutral-50 rounded-xl py-4
                                        lg:grid-cols-[1fr_1fr_1fr_56px]
                                        md:grid-cols-2
                                        grid-cols-1"
                                >
                                    <Select
                                        label={<span>Categoria <span style={{ color: "red" }}>*</span></span>}
                                        name="loanCategory"
                                        options={categorias}
                                        value={material.loanCategory}
                                        onChange={(e) =>
                                            handleMaterialChange(material.id, "loanCategory", e.target.value)
                                        }
                                        error={errors[`materials.${index}.loanCategory`]}
                                    />

                                    <Select
                                        label={<span>Nombre del producto <span style={{ color: "red" }}>*</span></span>}
                                        name="loanProductName"
                                        options={
                                            formData.loanMaterialType
                                                ? productOptions
                                                : [{ value: "", label: "Primero selecciona el tipo de material" }]
                                        }
                                        value={material.materialId ?? ""}
                                        onChange={(e) => handleProductSelect(material.id, e.target.value)}
                                        error={errors[`materials.${index}.loanProductName`]}
                                    />

                                    <Input
                                        label={<span>Cantidad <span style={{ color: "red" }}>*</span></span>}
                                        name="loanQuantity"
                                        placeholder="Cantidad"
                                        type="number"
                                        min="1"
                                        value={material.loanQuantity}
                                        onChange={(e) =>
                                            handleMaterialChange(material.id, "loanQuantity", e.target.value)
                                        }
                                        error={errors[`materials.${index}.loanQuantity`]}
                                    />

                                    <IconButton
                                        ariaLabel="Eliminar material"
                                        variant="ghost"
                                        hitSize={40}
                                        iconSize={18}
                                        disabled={formData.materials.length === 1}
                                        onClick={() => handleRemoveMaterial(material.id)}
                                        className="self-end lg:self-center lg:mt-6"
                                    >
                                        <Trash2 size={18} />
                                    </IconButton>
                                </div>
                            ))}

                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleAddMaterial}
                                >
                                    <Plus size={16} className="inline mr-1" />
                                    Agregar material
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-3 items-start w-full
                            lg:grid-cols-[1fr_1fr_1fr_56px]
                            md:grid-cols-2
                            grid-cols-1
                            ">

                            <Select
                                label={<span>Estado <span style={{ color: "red" }}>*</span></span>}
                                name="isActive"
                                options={[
                                    { value: "", label: "Seleccione una opcion" },
                                    { value: "true", label: "Activo" },
                                    { value: "false", label: "Inactivo" },
                                ]}
                                value={formData.isActive === "" ? "" : String(formData.isActive)}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData((prev) => ({
                                        ...prev,
                                        // "" (placeholder) se queda como "" en vez de
                                        // convertirse en false: si no, elegir "Seleccione
                                        // una opción" dejaba el préstamo como Inactivo.
                                        isActive: value === "" ? "" : value === "true",
                                    }));
                                }}
                                error={errors.isActive}
                            />
                            <Input
                                label={<span>Descripcion <span style={{ color: "red" }}>*</span></span>}
                                name="loanDescription"
                                placeholder="Ingrese la descripción"
                                type="text"
                                value={formData.loanDescription}
                                onChange={handleChange}
                                error={errors.loanDescription}
                            />
                            <Select
                                label={<span>Tipo de Prestamo <span style={{ color: "red" }}>*</span></span>}
                                name="loanType"
                                options={tipoPrestamo}
                                value={formData.loanType}
                                onChange={handleChange}
                                error={errors.loanType}
                                containerClassName="md:col-span-2 md:max-w-full lg:col-span-1 lg:max-w-[320px]"
                            />


                        </div>
                        <div className="flex justify-start">
                            <div>
                                <h4>
                                    Foto
                                </h4>
                                <FileInput
                                    value={formData.photo}
                                    onChange={(files) =>
                                        setFormData((prev) => ({ ...prev, photo: files }))
                                    }
                                    multiple={true}
                                />
                                {errors.photo && (
                                    <span className="text-red-500 text-sm">{errors.photo}</span>
                                )}
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex justify-end gap-3 pt-1 w-full">
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
                    <Modal
                        isOpen={isModalOpen}
                        title="Confirmar creación de préstamo"
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleSubmit}
                        confirmText="Crear"
                        cancelText="Cancelar"
                    >
                        <p>¿Seguro que deseas crear este préstamo?</p>
                    </Modal>
                </div>

            </div >
        </div >
    );
}
