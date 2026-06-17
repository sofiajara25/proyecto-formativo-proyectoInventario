import { useState } from "react";
import { Input, Button, Navbar, FileInput, Select } from "@/shared";
import { materialSchema } from "../schemas/materialSchema";
import { useNavigate } from "react-router-dom";
import { createConsumableMaterial } from "../services/consumableMaterialService";

export default function MaterialRegisterForm() {
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        materialAccountant: "",
        materialToolId: "",
        materialSenaPlate: "",
        materialName: "",
        materialEntryDate: "",
        materialQuantity: "",
        materialLocation: "",
        materialUnitValue: "",
        materialTotalValue: "",
        materialStatus: "",
        materialDescription: "",
        photo: [],
    });

    const estados = [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
    ];
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const parsedData = {
            ...formData,
            materialQuantity: Number(formData.materialQuantity),
            materialUnitValue: Number(formData.materialUnitValue),
            materialTotalValue: Number(formData.materialTotalValue),
        };

        // Validación con Zod
        const result = materialSchema.safeParse(parsedData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0];
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        // Si pasa la validación
        setErrors({});
        setIsSubmitting(true);

        try {
            // Llamamos al servicio frontend que consume la API
            // result.data contiene los datos ya validados por Zod
            const payload = {
                ...result.data,
                photo: result.data.photo?.[0]?.name ?? null,
            };
            const response = await createConsumableMaterial(payload);

            // Log informativo para desarrollo
            console.log("Material creado:", response);

            // Feedback básico al usuario
            alert("Material creado correctamente");

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

    let label;
    // 😂 lógica fuera del JSX
    if (isSubmitting) {
        label = "Creando...";
    } else {
        label = "Crear Material de Consumo";
    }

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background:
                    "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                fontFamily: "var(--main-font)",
            }}
        >
            <Navbar />

            <div className="flex flex-col flex-1 px-10 py-8 gap-4 justify-center">
                {/* Título */}
                <h1  className="lg:pl-[60px]"
                    style={{
                        color: "var(--color-white)",
                        fontSize: "var(--fs-md)",
                        fontWeight: "var(--font-weight-bold)",
                        margin: 0,
                    }}
                >
                    Crear Material de Consumo
                </h1>

                {/* Card */}
                <div
                    className="bg-white rounded-2xl flex flex-col gap-6 w-full max-w-6xl mx-auto"
                    style={{ padding: "32px 36px" }}
                >
                    <p
                        style={{
                            fontSize: "var(--fs-xxs)",
                            color: "var(--color-gray-500)",
                            margin: 0,
                        }}
                    >
                        Completa los campos para registrar un nuevo material
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 place-items-center gap-6"
                    >
                        <div className="grid grid-cols-3 gap-6 mx-auto">
                            <Input
                                label="Cuentadante"
                                name="materialAccountant"
                                value={formData.materialAccountant}
                                onChange={handleChange}
                                error={errors.materialAccountant}
                            />

                            <Input
                                label="ID Herramienta"
                                name="materialToolId"
                                value={formData.materialToolId}
                                onChange={handleChange}
                                error={errors.materialToolId}
                            />

                            <Input
                                label="Placa SENA"
                                name="materialSenaPlate"
                                value={formData.materialSenaPlate}
                                onChange={handleChange}
                                error={errors.materialSenaPlate}
                            />

                            <Input
                                label="Nombre del material"
                                name="materialName"
                                value={formData.materialName}
                                onChange={handleChange}
                                error={errors.materialName}
                            />

                            <Input
                                label="Fecha de ingreso"
                                type="date"
                                name="materialEntryDate"
                                value={formData.materialEntryDate}
                                onChange={handleChange}
                                error={errors.materialEntryDate}
                            />

                            <Input
                                label="Cantidad"
                                name="materialQuantity"
                                type="number"
                                value={formData.materialQuantity}
                                onChange={handleChange}
                                error={errors.materialQuantity}
                            />

                            <Input
                                label="Ubicación"
                                name="materialLocation"
                                value={formData.materialLocation}
                                onChange={handleChange}
                                error={errors.materialLocation}
                            />

                            <Input
                                label="Valor Unitario"
                                name="materialUnitValue"
                                type="number"
                                value={formData.materialUnitValue}
                                onChange={handleChange}
                                error={errors.materialUnitValue}
                            />

                            <Input
                                label="Valor Total"
                                name="materialTotalValue"
                                type="number"
                                value={formData.materialTotalValue}
                                onChange={handleChange}
                                error={errors.materialTotalValue}
                            />

                            <Select
                                label="Estado"
                                name="materialStatus"
                                options={estados}
                                value={formData.materialStatus}
                                onChange={handleChange}
                                error={errors.materialStatus}
                            />

                            <Input
                                label="Descripción"
                                name="materialDescription"
                                value={formData.materialDescription}
                                onChange={handleChange}
                                error={errors.materialDescription}
                            />

                            {/* Contenedor del input */}
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
                        <div className="flex justify-end gap-3 pt-2 w-full">
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

