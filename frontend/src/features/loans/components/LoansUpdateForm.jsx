import { useState, useEffect, useRef } from "react";
import { Input, Button, Select, Navbar, FileInput, Modal, TextArea, IconButton } from "@/shared";
import { loanUpdateSchema } from "../schemas/loansUpdateSchema.js";
import { getLoanById, updateLoan } from "../services/loanService.js";
import { getUsers } from "../../users/services/userService.js";
import { useNavigate, useParams } from "react-router-dom";
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
    const { loan_id } = useParams();
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
        isActive: true,
        loanType: "",
        photo: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Evita que el efecto de "reiniciar materiales al cambiar el tipo" se
    // dispare con el cambio inicial de loanMaterialType (de "" al valor que
    // trae el préstamo cargado): eso borraría los materiales que se acaban
    // de precargar. Solo debe reaccionar a cambios hechos por el usuario.
    const hydratedRef = useRef(false);

    // Guarda la fecha de préstamo tal como venía guardada, para solo exigir
    // "no puede ser anterior a hoy" si el usuario la cambia. Si no la toca,
    // un préstamo viejo (con fecha ya pasada) se puede seguir actualizando
    // sin que esa regla lo bloquee.
    const originalLoanDateRef = useRef(null);
    // Mismo caso para la fecha de devolución: préstamos viejos pueden traer
    // una fecha de devolución anterior a la de préstamo (dato inconsistente
    // de antes), y no debería bloquear guardar si no se está tocando.
    const originalReturnDateRef = useRef(null);

    // Listas reales de materiales (para el select de "Nombre del producto").
    // Cuál de las dos se usa depende de "loanMaterialType": un préstamo
    // Devolutivo descuenta de material devolutivo, uno de Consumo del de
    // consumo.
    const [returnableMaterials, setReturnableMaterials] = useState([]);
    const [consumableMaterials, setConsumableMaterials] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        fetch("http://localhost:5000/api/returnableMaterial")
            .then((res) => res.json())
            .then(setReturnableMaterials)
            .catch((err) => console.error("Error cargando materiales devolutivos:", err));

        // Material de consumo ahora requiere sesión (y el permiso
        // list_consumable_material) para listarse.
        fetch("http://localhost:5000/api/consumableMaterial", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then(setConsumableMaterials)
            .catch((err) => console.error("Error cargando materiales de consumo:", err));
    }, []);

    // Materiales disponibles para el tipo de préstamo elegido.
    const materialsForType =
        formData.loanMaterialType === "Devolutivo"
            ? returnableMaterials
            : formData.loanMaterialType === "Consumo"
                ? consumableMaterials
                : [];

    // Usuarios registrados, para buscar y autocompletar en vez de tener que
    // ir a "Usuarios" a copiar el número de documento a mano.
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch((err) => console.error("Error cargando usuarios:", err));
    }, []);

    // Mismo campo "Usuarios" de siempre, con autocompletado (datalist): si
    // el nombre escrito coincide con un usuario registrado, se completa
    // solo el número de documento; si no coincide, queda libre para
    // escribir el correo (usuario no registrado).
    const handleLoanUserChange = (e) => {
        const { value } = e.target;
        const chosen = users.find((u) => `${u.user_name} ${u.user_lastname}` === value);
        setFormData((prev) => ({
            ...prev,
            loanUser: value,
            loanUserIdentification: chosen ? chosen.document_number : prev.loanUserIdentification,
        }));
    };

    const productOptions = [
        { value: "", label: "Selecciona un material" },
        ...materialsForType.map((m) => ({
            value: String(m.id),
            label: `${m.material_name} (disponible: ${m.quantity})`,
        })),
    ];

    const handleProductSelect = (rowId, selectedId) => {
        const chosen = materialsForType.find((m) => String(m.id) === String(selectedId));
        setFormData((prev) => ({
            ...prev,
            materials: prev.materials.map((m) =>
                m.id === rowId
                    ? {
                        ...m,
                        materialId: selectedId,
                        loanProductName: chosen?.material_name ?? "",
                        // La categoría ya no se elige a mano: se toma
                        // directamente de la categoría real asignada al
                        // material seleccionado (catálogo de categorías).
                        loanCategory: chosen?.category_name ?? "",
                    }
                    : m
            ),
        }));
    };

    const tipoMaterial = [
        { value: "", label: "Seleccione una opcion" },
        { value: "Devolutivo", label: "Devolutivo" },
        { value: "Consumo", label: "Consumo" },
    ]

    const tipoPrestamo = [
        { value: "", label: "Seleccione una opcion" },
        { value: "interno", label: "Interno" },
        { value: "externo.", label: "Externo." },
    ]

    useEffect(() => {
        getLoanById(loan_id)
            .then((data) => {
                // Guardamos la fecha de préstamo tal como venía, para poder
                // comparar más adelante si el usuario realmente la cambió.
                originalLoanDateRef.current = data.loan_date?.slice(0, 10) || "";
                originalReturnDateRef.current = data.return_date?.slice(0, 10) || "";

                // Fusionamos con el estado anterior en vez de reemplazarlo por
                // completo: si no lo hacemos así, campos que no se listan acá
                // (como "materials") quedan en undefined y rompen el .map()
                // del render.
                return setFormData((prev) => ({
                    ...prev,
                    // Ojo: si el backend devuelve null (columna vacía en la
                    // BD) en vez de un string vacío, Zod lo rechaza porque
                    // ".string()" no acepta null (solo undefined con
                    // .optional()). Eso hacía fallar la validación en
                    // silencio con campos que el usuario ni tocó.
                    loanMaterialType: data.material_type ?? "",
                    loanUser: data.loan_user ?? "",
                    loanUserIdentification: data.user_identification ?? "",
                    loanApprenticeGroup: data.apprentice_group ?? "",
                    loanDate: data.loan_date?.slice(0, 10) || "",
                    loanReturnDate: data.return_date?.slice(0, 10) || "",
                    loanDescription: data.description ?? "",
                    loanType: data.loan_type ?? "",
                    isActive: data.is_active ?? true,
                    // El backend devuelve "materials" con id/category/product_name/quantity;
                    // el formulario espera loanCategory/loanProductName/loanQuantity.
                    materials:
                        Array.isArray(data.materials) && data.materials.length
                            ? data.materials.map((m) => ({
                                  // "id" es solo la key local de React/del
                                  // formulario (el esquema exige string); el
                                  // id real del ítem en loan_items (numérico)
                                  // no hace falta conservarlo aquí.
                                  id: crypto.randomUUID(),
                                  materialId: m.material_id != null ? String(m.material_id) : "",
                                  loanCategory: m.category ?? "",
                                  loanProductName: m.product_name ?? "",
                                  loanQuantity: m.quantity ?? 1,
                              }))
                            : [crearMaterialVacio()],
                    // El backend devuelve "photos" con TODAS las fotos
                    // (portada + galería). Si por algún motivo no viene,
                    // caemos a mostrar solo la portada.
                    photo: Array.isArray(data.photos)
                        ? data.photos
                        : (data.photo_url ? [data.photo_url] : []),
                }));
            })
            .then(() => {
                hydratedRef.current = true;
            })
            .catch((err) => console.error("Error cargando prestamo:", err));
    }, [loan_id]);

    // Si el usuario cambia el tipo de préstamo DESPUÉS de que ya cargó
    // (Devolutivo <-> Consumo), la lista de materiales disponibles cambia
    // por completo: limpiamos las selecciones para no dejar un materialId
    // de la tabla equivocada colgado en algún renglón.
    useEffect(() => {
        if (!hydratedRef.current) return;
        setFormData((prev) => ({
            ...prev,
            materials: prev.materials.map((m) => ({ ...m, materialId: "", loanProductName: "" })),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.loanMaterialType]);

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
            const result = loanUpdateSchema.safeParse(formData);

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
                console.warn("Errores de validación al actualizar el préstamo:", fieldErrors);
                alert(
                    "Revisa el formulario, hay campos con error:\n" +
                        Object.entries(fieldErrors).map(([field, msg]) => `- ${field}: ${msg}`).join("\n")
                );
                return;
            }

            // Validar fechas igual que en crear
            const today = new Date();
            const loanDate = new Date(formData.loanDate);
            const returnDate = new Date(formData.loanReturnDate);

            today.setHours(0, 0, 0, 0);
            loanDate.setHours(0, 0, 0, 0);
            returnDate.setHours(0, 0, 0, 0);

            // Solo exigimos "no anterior a hoy" si el usuario REALMENTE cambió
            // la fecha de préstamo. Si la dejó como estaba, un préstamo viejo
            // (con fecha ya pasada) se puede seguir actualizando sin problema.
            const loanDateChanged = formData.loanDate !== originalLoanDateRef.current;
            if (loanDateChanged && loanDate < today) {
                setErrors({ loanDate: "La fecha de préstamo no puede ser anterior a hoy" });
                alert("La fecha de préstamo no puede ser anterior a hoy.");
                return;
            }

            // Igual que con la fecha de préstamo: solo bloqueamos si el
            // usuario cambió la fecha de préstamo o la de devolución. Un
            // préstamo viejo puede traer las dos fechas ya inconsistentes
            // entre sí, y eso no debería impedir guardar otros cambios.
            const returnDateChanged = formData.loanReturnDate !== originalReturnDateRef.current;
            if ((loanDateChanged || returnDateChanged) && returnDate < loanDate) {
                setErrors({ loanReturnDate: "La fecha de devolución no puede ser anterior a la fecha de préstamo" });
                alert("La fecha de devolución no puede ser anterior a la fecha de préstamo.");
                return;
            }

            setErrors({});

            const response = await updateLoan(loan_id, result.data);
            console.log("Préstamo actualizado:", response);
            navigate(-1);
        } catch (error) {
            console.error("Error actualizando préstamo:", error);
            alert(error?.message || "Ocurrió un error inesperado al actualizar el préstamo.");
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    };


    let label;
    if (isSubmitting) {
        label = "Actualizando...";
    } else {
        label = "Actualizar prestamo";
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
                    Actualizar Préstamo
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
                                label="Tipo de Material"
                                name="loanMaterialType"
                                options={tipoMaterial}
                                value={formData.loanMaterialType}
                                onChange={handleChange}
                                error={errors.loanMaterialType}
                            />

                            <Input
                                label="Usuarios"
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
                                label="Identificación del Usuario"
                                name="loanUserIdentification"
                                placeholder="N° de documento o correo si no está registrado"
                                type="text"
                                value={formData.loanUserIdentification}
                                onChange={handleChange}
                                error={errors.loanUserIdentification}
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
                                label="Fecha prestamos"
                                name="loanDate"
                                type="date"
                                value={formData.loanDate}
                                onChange={handleChange}
                                error={errors.loanDate}
                                // Ojo: NO ponemos min={localToday} aquí. Si un
                                // préstamo viejo ya tiene una fecha pasada y el
                                // usuario no la toca, el navegador bloquearía
                                // el envío del formulario a nivel nativo (antes
                                // de que corra nuestra validación en JS) por
                                // considerar el valor "fuera de rango". La regla
                                // de "no anterior a hoy" ya se aplica en JS,
                                // pero solo si el usuario realmente la cambia.
                            />

                            <Input
                                label="Fecha devolucion "
                                name="loanReturnDate"
                                type="date"
                                value={formData.loanReturnDate}
                                onChange={handleChange}
                                error={errors.loanReturnDate}
                                // Sin "min": mismo caso que "Fecha prestamos" arriba.
                                // Un préstamo viejo puede traer una fecha de
                                // devolución anterior a la de préstamo (dato ya
                                // inconsistente), y el "min" nativo bloquearía el
                                // envío aunque el usuario no toque este campo. La
                                // validación real corre en JS y solo exige la
                                // regla si el usuario cambió alguna de las fechas.
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
                                    {/* Ya no se elige a mano: se completa sola con la
                                        categoría real del material elegido abajo. */}
                                    <Input
                                        label="Categoria "
                                        name="loanCategory"
                                        value={material.loanCategory}
                                        disabled
                                        readOnly
                                        placeholder="Selecciona un producto"
                                        error={errors[`materials.${index}.loanCategory`]}
                                    />

                                    <Select
                                        label="Nombre del producto "
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
                                        label="Cantidad "
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
                                label="Estado "
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
                                label="Descripcion "
                                name="loanDescription"
                                placeholder="Ingrese la descripción"
                                type="text"
                                value={formData.loanDescription}
                                onChange={handleChange}
                                error={errors.loanDescription}
                            />
                            <Select
                                label="Tipo de Prestamo "
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
                        title="Confirmar actualización de préstamo"
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleSubmit}
                        confirmText="Actualizar"
                        cancelText="Cancelar"
                    >
                        <p>¿Seguro que deseas actualizar este préstamo?</p>
                    </Modal>
                </div>

            </div >
        </div >
    );
}