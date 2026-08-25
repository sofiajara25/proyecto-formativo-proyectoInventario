import { useEffect, useState } from "react";
import { Input, Button, Navbar, FileInput, Select, Modal, TextArea } from "@/shared";
import { materialSchema } from "../schemas/materialSchema";
import { useNavigate } from "react-router-dom";
import { createConsumableMaterial, getNextConsumableToolId } from "../services/consumableMaterialService";
import { getCategorys } from "../../categorys/service/categoryService";
import { QuotationsPicker } from "../../quotations";

export default function MaterialRegisterForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        materialAccountant: "",
        materialSenaPlate: "",
        materialName: "",
        materialEntryDate: "",
        materialQuantity: "",
        inventoryNameId: "",
        materialLocation: "",
        materialUnitValue: "",
        materialTotalValue: "",
        materialStatus: "",
        materialDescription: "",
        brandId: "",
        categoryId: "",
        quotationIds: [],
        materialTechnicalSheet: [],
        photo: [],
    });

    const estados = [
        { value: "", label: "Selecciona una opción" },
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" },
    ];

    const [errors, setErrors] = useState({});

    const [brands, setBrands] = useState([]);

    const [inventoryNames, setInventoryNames] = useState([]);

    const [categorias, setCategorias] = useState([]);

    // Vista previa del ID que el backend le va a asignar al material al
    // guardarlo (ej. "CON-0007"). No se puede editar, solo se muestra.
    const [nextToolId, setNextToolId] = useState("Calculando...");

    useEffect(() => {
        getCategorys()
            .then((data) => {
                const options = data.map((c) => ({
                    value: c.category_id,
                    label: `${c.category_name} (${c.element_type})`,
                }));
                setCategorias([{ value: "", label: "Selecciona una categoría" }, ...options]);
            })
            .catch((err) => console.error("Error cargando categorías:", err));
    }, []);

    // Fecha de hoy en formato YYYY-MM-DD usando la zona horaria local
    // (evita el corrimiento de un día que da new Date().toISOString()).
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const localToday = `${yyyy}-${mm}-${dd}`;

    useEffect(() => {
        fetch("http://localhost:5000/api/brands")
            .then(res => res.json())
            .then(data => {
                const options = data.map(b => ({ value: b.id, label: b.marca }));
                setBrands([{ value: "", label: "Selecciona una marca" }, ...options]);
            })
            .catch(err => console.error("Error cargando marcas:", err));
    }, []);
    useEffect(() => {
        fetch("http://localhost:5000/api/inventory-names")
            .then(res => res.json())
            .then(data => {
                const options = data.map(i => ({ value: i.inventory_name_id, label: i.inventory_name }));
                setInventoryNames([{ value: "", label: "Selecciona un nombre de inventario" }, ...options]);
            })
            .catch(err => console.error("Error cargando nombre de inventarios:", err));
    }, []);

    useEffect(() => {
        getNextConsumableToolId()
            .then(setNextToolId)
            .catch((err) => {
                console.error("Error obteniendo el próximo ID:", err);
                setNextToolId("Se generará automáticamente");
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prev) => {
            const newData = {
                ...prev,
                [name]: files ? files[0] : value,
            };

            // Si cambian cantidad o valor unitario, recalcular total
            if (name === "materialQuantity" || name === "materialUnitValue") {
                const quantity = Number(newData.materialQuantity) || 0;
                const unitValue = Number(newData.materialUnitValue) || 0;
                newData.materialTotalValue = quantity * unitValue;
            }

            return newData;
        });
    };
    ;

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const parsedData = {
            ...formData,
            // Si no se seleccionó marca, enviamos null (no 0): brandId=0 no
            // existe en la tabla brands y rompe la llave foránea.
            brandId: formData.brandId ? Number(formData.brandId) : null,
            categoryId: formData.categoryId ? Number(formData.categoryId) : null,
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
            const response = await createConsumableMaterial(result.data);
            console.log("Material creado:", response);
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

            <div className="flex flex-col flex-1 px-4 sm:px-10 py-2 sm:py-1 gap-1 justify-center">

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
                    Crear Material de Consumo
                </h1>

                {/* Card */}
                <div
                    className="bg-white rounded-2xl flex flex-col gap-6 w-full max-w-6xl mx-auto"
                    style={{ padding: "16px 16px" }}
                >
                    <form
                        onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                        className="grid grid-cols-1 place-items-center gap-4"
                    >
                        <div className="grid gap-2 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <Input
                                    label={<span>Cuentadante<span style={{ color: "red" }}>*</span></span>}
                                    name="materialAccountant"
                                    value={formData.materialAccountant}
                                    onChange={handleChange}
                                    error={errors.materialAccountant}
                                />
                            </div>

                            {/* El Id del material se muestra pero no es editable: el
                                backend lo genera automáticamente al crear el registro.
                                Aquí solo mostramos una vista previa del valor. */}
                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <Input
                                    label="Id del material"
                                    name="materialToolId"
                                    value={nextToolId}
                                    disabled
                                    readOnly
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
                                    label={<span>Nombre del material<span style={{ color: "red" }}>*</span></span>}
                                    name="materialName"
                                    value={formData.materialName}
                                    onChange={handleChange}
                                    error={errors.materialName}
                                />
                            </div>

                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <Input
                                    label={<span>Fecha Ingreso<span style={{ color: "red" }}>*</span></span>}
                                    type="date"
                                    name="materialEntryDate"
                                    value={formData.materialEntryDate}
                                    onChange={handleChange}
                                    error={errors.materialEntryDate}
                                    min={localToday}
                                />
                            </div>

                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <Input
                                    label={<span>Cantidad<span style={{ color: "red" }}>*</span></span>}
                                    name="materialQuantity"
                                    type="number"
                                    value={formData.materialQuantity}
                                    onChange={handleChange}
                                    error={errors.materialQuantity}
                                />
                            </div>
                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <Select
                                    label={<span>Nombre de inventario<span style={{ color: "red" }}>*</span></span>}
                                    name="inventoryNameId"
                                    options={inventoryNames}
                                    value={formData.inventoryNameId}
                                    onChange={handleChange}
                                    error={errors.inventoryNameId}
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
                                    label={<span>Valor unitario<span style={{ color: "red" }}>*</span></span>}
                                    name="materialUnitValue"
                                    type="number"
                                    value={formData.materialUnitValue}
                                    onChange={handleChange}
                                    error={errors.materialUnitValue}
                                />
                            </div>

                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <Input
                                    label={<span>Valor total<span style={{ color: "red" }}>*</span></span>}
                                    name="materialTotalValue"
                                    type="number"
                                    value={formData.materialTotalValue}
                                    onChange={handleChange}
                                    error={errors.materialTotalValue}
                                    readOnly
                                />
                            </div>

                            <div className="w-full [&>div]:w-full [&>div>select]:w-full">
                                <Select
                                    label={<span>Estado<span style={{ color: "red" }}>*</span></span>}
                                    name="materialStatus"
                                    options={estados}
                                    value={formData.materialStatus}
                                    onChange={handleChange}
                                    error={errors.materialStatus}
                                />
                            </div>

                            <div className="w-full [&>div]:w-full [&>div>textarea]:w-full">
                                <TextArea
                                    label={<span>Descripcion<span style={{ color: "red" }}>*</span></span>}
                                    name="materialDescription"
                                    value={formData.materialDescription}
                                    onChange={handleChange}
                                    error={errors.materialDescription}
                                    rows={1}
                                />
                            </div>
                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <Select
                                    label="Marca"
                                    name="brandId"
                                    options={brands}
                                    value={formData.brandId}
                                    onChange={handleChange}
                                    error={errors.brandId}
                                />
                            </div>
                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <Select
                                    label={<span>Categoría<span style={{ color: "red" }}>*</span></span>}
                                    name="categoryId"
                                    options={categorias}
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    error={errors.categoryId}
                                />
                            </div>
                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <QuotationsPicker
                                    value={formData.quotationIds}
                                    onChange={(ids) => setFormData((prev) => ({ ...prev, quotationIds: ids }))}
                                    error={errors.quotationIds}
                                />
                            </div>

                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 col-span-full">
                                    {/* Fila 6 — Archivos */}
                                    <div className="min-w-0">
                                        <span>Ficha Técnica <span style={{ color: "red" }}>*</span></span>
                                        <FileInput
                                            value={formData.materialTechnicalSheet}
                                            onChange={(files) =>
                                                setFormData((prev) => ({ ...prev, materialTechnicalSheet: files }))
                                            }
                                            multiple={true}
                                        />
                                        {errors.materialTechnicalSheet && (
                                            <span className="text-red-500 text-sm">{errors.materialTechnicalSheet}</span>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <span>Foto <span style={{ color: "red" }}>*</span></span>
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
                            </div>


                        </div>

                        {/* Acciones */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-1 w-full">
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
                        title="Confirmar creación de material de consumo"
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleSubmit}
                        confirmText="Crear"
                        cancelText="Cancelar"
                    >
                        <p>¿Seguro que deseas crear este material de consumo?</p>
                    </Modal>

                </div>
            </div>
        </div>
    );
}