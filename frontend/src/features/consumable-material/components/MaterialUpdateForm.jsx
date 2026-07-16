    import { useEffect, useState } from "react";
    import { Input, Button, Navbar, FileInput, Modal, TextArea } from "@/shared";
    import { materialSchema } from "../schemas/materialSchema";
    import { useNavigate, useParams } from "react-router-dom";
    import { getConsumableById, updateConsumable } from "../services/consumableMaterialService";

    export default function MaterialRegisterForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams();

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

    const [errors, setErrors] = useState({});

    useEffect(() => {
        getConsumableById(id)
        .then((data) =>
            setFormData({
            materialAccountant: data.accountant,
            materialToolId: data.tool_id,
            materialSenaPlate: data.sena_plate,
            materialName: data.material_name,
            materialEntryDate: data.entry_date?.slice(0, 10) || "",
            materialQuantity: data.quantity,
            materialLocation: data.location,
            materialUnitValue: data.unit_value,
            materialTotalValue: data.total_value,
            materialStatus: data.status,
            materialDescription: data.description,
            photo: [],
            })
        )
        .catch((err) => console.error("Error cargando material:", err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const parsedData = {
        ...formData,
        materialQuantity: Number(formData.materialQuantity),
        materialUnitValue: Number(formData.materialUnitValue),
        materialTotalValue: Number(formData.materialTotalValue),
        };

        const result = materialSchema.safeParse(parsedData);
        if (!result.success) {
        const fieldErrors = {};
        result.error.issues.forEach((issue) => {
            const field = issue.path[0];
            fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
        }

        setErrors({});
        try {
        await updateConsumable(id, result.data);
        alert("Material actualizado correctamente");
        navigate(-1);
        } catch (error) {
        console.error("Error:", error.message);
        alert(error.message);
        } finally {
        setIsSubmitting(false);
        setIsModalOpen(false);
        }
    };

    let label;
    if (isSubmitting) {
        label = "Actualizando...";
    } else {
        label = "Actualizar Material de Consumo";
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

        <div className="flex flex-col flex-1 px-4 sm:px-10 py-4 sm:py-6 gap-4 justify-center">

            {/* Título */}
            <h1
            className="sm:pl-[60px]"
            style={{
                color: "var(--color-white)",
                fontSize: "var(--fs-md)",
                fontWeight: "var(--font-weight-bold)",
                margin: 0,
            }}
            >
            Actualizar Material de Consumo
            </h1>

            {/* Card */}
            <div
            className="bg-white rounded-2xl flex flex-col gap-6 w-full max-w-6xl mx-auto"
            style={{ padding: "20px 16px" }}
            >
            <form
                onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                className="grid grid-cols-1 place-items-center gap-4"
            >
                <div className="grid gap-4 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                    <Input
                    label="Cuentadante"
                    name="materialAccountant"
                    value={formData.materialAccountant}
                    onChange={handleChange}
                    error={errors.materialAccountant}
                    />
                </div>

                <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                    <Input
                    label="ID de herramienta"
                    name="materialToolId"
                    value={formData.materialToolId}
                    onChange={handleChange}
                    error={errors.materialToolId}
                    />
                </div>

                <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                    <Input
                    label="Placa SENA"
                    name="materialSenaPlate"
                    value={formData.materialSenaPlate}
                    onChange={handleChange}
                    error={errors.materialSenaPlate}
                    />
                </div>

                <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                    <Input
                    label="Nombre del material"
                    name="materialName"
                    value={formData.materialName}
                    onChange={handleChange}
                    error={errors.materialName}
                    />
                </div>

                <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                    <Input
                    label="Fecha de ingreso"
                    type="date"
                    name="materialEntryDate"
                    value={formData.materialEntryDate}
                    onChange={handleChange}
                    error={errors.materialEntryDate}
                    />
                </div>

                <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                    <Input
                    label="Cantidad"
                    type="number"
                    name="materialQuantity"
                    value={formData.materialQuantity}
                    onChange={handleChange}
                    error={errors.materialQuantity}
                    />
                </div>

                <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                    <Input
                    label="Ubicación"
                    name="materialLocation"
                    value={formData.materialLocation}
                    onChange={handleChange}
                    error={errors.materialLocation}
                    />
                </div>

                <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                    <Input
                    label="Valor unitario"
                    type="number"
                    name="materialUnitValue"
                    value={formData.materialUnitValue}
                    onChange={handleChange}
                    error={errors.materialUnitValue}
                    />
                </div>

                <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                    <Input
                    label="Valor total"
                    type="number"
                    name="materialTotalValue"
                    value={formData.materialTotalValue}
                    onChange={handleChange}
                    error={errors.materialTotalValue}
                    />
                </div>

                <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                    <Input
                    label="Estado"
                    name="materialStatus"
                    value={formData.materialStatus}
                    onChange={handleChange}
                    error={errors.materialStatus}
                    />
                </div>

                <div className="w-full [&>div]:w-full [&>div>textarea]:w-full">
                    <TextArea
                    label="Descripción"
                    name="materialDescription"
                    value={formData.materialDescription}
                    onChange={handleChange}
                    error={errors.materialDescription}
                    rows={1}
                    />
                </div>

                <div>
                    <h4 className="text-xs mb-1">Foto</h4>
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
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 w-full">
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
                </Button>
                </div>

            </form>

            <Modal
                isOpen={isModalOpen}
                title="Confirmar actualización de material de consumo"
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSubmit}
                confirmText="Actualizar"
                cancelText="Cancelar"
            >
                <p>¿Seguro que deseas actualizar este material de consumo?</p>
            </Modal>

            </div>
        </div>
        </div>
    );
    }