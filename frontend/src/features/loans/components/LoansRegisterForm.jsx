import { useState } from "react";
import { Input, Button, Select, Navbar, FileInput, IconButton } from "@/shared";
import { loanSchema } from "../schemas/loansSchema.js";
import { createLoan } from "../services/loanService.js";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";

function crearMaterialVacio() {
    return {
        id: crypto.randomUUID(),
        loanCategory: "",
        loanProductName: "",
        loanQuantity: 1,
    };
}

export default function LoansRegisterForm() {

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación con Zod
        const result = loanSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0];
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            if (!formData.materials.length) {
                setErrors({ materials: "Debe agregar al menos un material" });
                setIsSubmitting(false);
                return;
            }

            const payload = {
                ...result.data,
                materials: formData.materials.map(({ loanCategory, loanProductName, loanQuantity }) => ({
                    loanCategory,
                    loanProductName,
                    loanQuantity: Number(loanQuantity),
                })),
                photo: formData.photo,
            };

            const response = await createLoan(payload);

            console.log("Préstamo creado:", response);
            alert("Préstamo creado correctamente");

            // Volver atrás
            window.history.back();
        } catch (error) {
            console.error("Error:", error.message);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
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

            <div className="flex flex-col flex-1 px-10 py-1 gap-1 justify-center">

                {/* Título */}
                <h1 className="lg:pl-[70px]"
                    style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0, }}>
                    Crear Préstamo
                </h1>

                {/* Card */}
                <div className="bg-white rounded-2xl flex flex-col gap-6 w-full max-w-6xl mx-auto " style={{ padding: "18px 36px" }}>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1  gap-2">

                        <div
                            className="grid gap-3 items-start
                            lg:grid-cols-[2fr_2fr_1fr_56px]
                            md:grid-cols-2
                            sm:grid-cols-1"
                        >
                            <Select
                                label={<span>Tipo de Material <span style={{ color: "red" }}>*</span></span>}
                                name="loanMaterialType"
                                options={tipoMaterial}
                                value={formData.loanMaterialType}
                                onChange={handleChange}
                                error={errors.loanMaterialType}
                            />

                            <Input
                                label={<span>Usuarios<span style={{ color: "red" }}>*</span></span>}
                                name="loanUser"
                                placeholder="Ingrese el nombre usuario"
                                type="text"
                                value={formData.loanUser}
                                onChange={handleChange}
                                error={errors.loanUser}
                            />
                            <Input
                                label={<span>Identificación del Usuario<span style={{ color: "red" }}>*</span></span>}
                                name="loanUserIdentification"
                                placeholder="Ingrese el nombre usuario"
                                type="text"
                                value={formData.loanUserIdentification}
                                onChange={handleChange}
                                error={errors.loanUserIdentification}
                            />

                        </div>
                        <div
                            className="grid gap-3 items-start
                            lg:grid-cols-[2fr_2fr_1fr_56px]
                            md:grid-cols-2
                            sm:grid-cols-1"
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
                            />

                            <Input
                                label={<span>Fecha devolucion <span style={{ color: "red" }}>*</span></span>}
                                name="loanReturnDate"
                                type="date"
                                value={formData.loanReturnDate}
                                onChange={handleChange}
                                error={errors.loanReturnDate}
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
                                    className="grid gap-6 items-start bg-neutral-50 rounded-xl py-4 pr-4 pl-0
                                        lg:grid-cols-[2fr_2fr_1fr_auto]
                                        md:grid-cols-1
                                        sm:grid-cols-1"
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

                                    <Input
                                        label={<span>Nombre del producto <span style={{ color: "red" }}>*</span></span>}
                                        name="loanProductName"
                                        placeholder="Ingrese el nombre del producto"
                                        type="text"
                                        value={material.loanProductName}
                                        onChange={(e) =>
                                            handleMaterialChange(material.id, "loanProductName", e.target.value)
                                        }
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
                                        className="self-center mt-6"
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

                        <div className="grid gap- w-full -mt-6 pr-10
                            lg:grid-cols-[1fr_1fr_1fr_auto]
                            md:grid-cols-1
                            sm:grid-cols-1
                            ">

                            <Select
                                label={<span>Estado <span style={{ color: "red" }}>*</span></span>}
                                name="isActive"
                                options={[
                                    { value: "", label: "Seleccione una opcion" },
                                    { value: "true", label: "Activo" },
                                    { value: "false", label: "Inactivo" },
                                ]}
                                value={String(formData.isActive)}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        isActive: e.target.value === "true",
                                    }))
                                }
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
                </div>

            </div >
        </div >
    );
}
