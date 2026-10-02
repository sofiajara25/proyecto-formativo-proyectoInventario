import { useEffect, useState, useCallback } from "react";
import { Input, Button, Navbar, FileInput, Modal, TextArea, Select, MultiSelect, QuickCreateSelect } from "@/shared";
import { useNavigate, useParams } from "react-router-dom";
import { getConsumableById, updateConsumable } from "../services/consumableMaterialService";
import { updateMaterialSchema } from "../schemas/updateMaterialSchema";
import { getCategorys, createCategoryOption } from "../../categorys/service/categoryService";
import { getBrands, createBrandOption } from "../../brands/service/brandService";
import { getInventoryName, createInventoryNameOption } from "../../inventory-name/services/inventoryNameService";
import { QuotationsPicker } from "../../quotations";
import { showAlert, showSuccessAndThen } from "@/shared/utils/alertBus";
import { brandSchema } from "../../brands/schemas/brandsSchema";
import { inventoryNameSchema } from "../../inventory-name/schemas/inventoryNameSchema";
import { hasPermission } from "@/shared/utils/permissions";
import { getUserOptions } from "../../users/services/userService";
import { categorySchema } from "../../categorys/schemas/categorysSchema";
import { useFormExitGuard } from "@/shared/hooks/useFormExitGuard";

export default function MaterialRegisterForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams();

    const [formData, setFormData] = useState({
        materialAccountants: [],
        materialToolId: "",
        materialSenaPlate: "",
        materialSerial: "",
        materialName: "",
        materialModel: "",
        materialEntryDate: "",
        materialPurchaseDate: "",
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

    // Pregunta antes de salir si ya hay datos ingresados (botón Cancelar
    // del formulario y Cancelar de la ventana de confirmación).
    const { markClean, requestExit, exitModal } = useFormExitGuard(formData, () => navigate(-1));

    // Lo que se carga de la base de datos no cuenta como "datos ingresados".
    const setLoadedData = useCallback((data) => {
        setFormData(data);
        markClean(data);
    }, [markClean]);

    const [errors, setErrors] = useState({});

    const [brands, setBrands] = useState([]);

    const [inventoryNames, setInventoryNames] = useState([]);

    // Usuarios activos del sistema: los cuentadantes son usuarios reales
    // (llave foránea a users), ya no texto libre.
    const [userOptions, setUserOptions] = useState([]);

    useEffect(() => {
        getUserOptions()
            .then(setUserOptions)
            .catch((err) => console.error("Error cargando usuarios:", err));
    }, []);

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        getCategorys()
            .then((data) => {
                const options = data.map((c) => ({
                    value: c.category_id,
                    label: c.category_name,
                }));
                setCategorias([{ value: "", label: "Selecciona una categoría" }, ...options]);
            })
            .catch((err) => console.error("Error cargando categorías:", err));
    }, []);

    useEffect(() => {
        getBrands()
            .then(data => {
                const options = data.map(b => ({ value: b.id, label: b.marca }));
                setBrands([{ value: "", label: "Selecciona una marca" }, ...options]);
            })
            .catch(err => console.error("Error cargando marcas:", err));
    }, []);

    useEffect(() => {
        getInventoryName()
            .then(data => {
                const options = data.map(n => ({ value: n.inventory_name_id, label: n.inventory_name }));
                setInventoryNames([{ value: "", label: "Selecciona un nombre de inventario" }, ...options]);
            })
            .catch(err => console.error("Error cargando nombre de inventarios:", err));
    }, []);

    useEffect(() => {
        getConsumableById(id)
            .then((data) =>
                setLoadedData({
                    materialAccountants: Array.isArray(data.accountant_ids) ? data.accountant_ids : [],
                    materialToolId: data.tool_id,
                    materialSenaPlate: data.sena_plate,
                    // Serial y modelo son opcionales: si vienen null se
                    // pasan a "" para que el schema (z.string()) no falle.
                    materialSerial: data.serial ?? "",
                    materialName: data.material_name,
                    materialModel: data.model ?? "",
                    materialEntryDate: data.entry_date?.slice(0, 10) || "",
                    materialPurchaseDate: data.purchase_date?.slice(0, 10) || "",
                    materialQuantity: data.quantity,
                    // Si no hay marca / nombre de inventario asignado, el
                    // backend devuelve null. El <select> de React no acepta
                    // "value={null}" (advertencia en consola), así que
                    // caemos a "" para que se vea la opción "Selecciona...".
                    // El schema espera un string ("z.string()"), pero el
                    // backend devuelve el id como número: si no se
                    // convierte, la validación falla con "Invalid input:
                    // expected string, received number" en cuanto el
                    // usuario guarda sin tocar este campo.
                    inventoryNameId: data.inventory_name_id != null ? String(data.inventory_name_id) : "",
                    materialLocation: data.location,
                    materialUnitValue: data.unit_value,
                    materialTotalValue: data.total_value,
                    materialStatus: data.status,
                    materialDescription: data.description,
                    brandId: data.brand_id ?? "",
                    categoryId: data.category_id ?? "",
                    // "quotations" viene del backend como el arreglo de
                    // cotizaciones ya enlazadas a este material.
                    quotationIds: Array.isArray(data.quotations)
                        ? data.quotations.map((q) => q.quotation_id)
                        : [],
                    // Precargamos el archivo/foto ya guardados para que se
                    // vean en el formulario y el usuario sepa qué va a
                    // reemplazar. Si no toca el campo, se conservan tal cual.
                    materialTechnicalSheet: data.technical_sheet ? [data.technical_sheet] : [],
                    // El backend devuelve "photos" con TODAS las fotos
                    // (portada + galería). Si por algún motivo no viene,
                    // caemos a mostrar solo la portada.
                    photo: Array.isArray(data.photos)
                        ? data.photos
                        : (data.photo_url ? [data.photo_url] : []),
                })
            )
            .catch((err) => console.error("Error cargando material:", err));
    }, [id, setLoadedData]);

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
            // Si no hay marca seleccionada, null (no 0): brandId=0 no existe
            // en la tabla brands y rompe la llave foránea.
            brandId: formData.brandId ? Number(formData.brandId) : null,
            categoryId: formData.categoryId ? Number(formData.categoryId) : null,
            materialQuantity: Number(formData.materialQuantity),
            materialUnitValue: Number(formData.materialUnitValue),
            materialTotalValue: Number(formData.materialTotalValue),
        };

        const result = updateMaterialSchema.safeParse(parsedData);
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
            showSuccessAndThen("Material de consumo actualizado con éxito", () => navigate(-1));
        } catch (error) {
            console.error("Error:", error.message);
            showAlert(error.message, { type: "error" });
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

            <div className="flex flex-col flex-1 px-4 sm:px-10 py-4 sm:py-1 gap-1 justify-center">

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
                    className="bg-white rounded-2xl flex flex-col gap-2 w-full max-w-6xl mx-auto"
                    style={{ padding: "16px 16px" }}
                >
                    <form
                        onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                        className="grid grid-cols-1 place-items-center gap-4"
                    >
                        <div className="grid gap-2 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <MultiSelect
                                    options={userOptions}
                                    label="Cuentadante(s)"
                                    name="materialAccountants"
                                    values={formData.materialAccountants}
                                    onChange={(values) => setFormData((prev) => ({ ...prev, materialAccountants: values }))}
                                    error={errors.materialAccountants}
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
                                    label="Serial Number (SN)"
                                    name="materialSerial"
                                    value={formData.materialSerial}
                                    onChange={handleChange}
                                    error={errors.materialSerial}
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
                                    label="Modelo"
                                    name="materialModel"
                                    value={formData.materialModel}
                                    onChange={handleChange}
                                    error={errors.materialModel}
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
                                    label="Fecha de compra"
                                    type="date"
                                    name="materialPurchaseDate"
                                    value={formData.materialPurchaseDate}
                                    onChange={handleChange}
                                    error={errors.materialPurchaseDate}
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
                                <QuickCreateSelect
                                    label="Nombre de inventario"
                                    name="inventoryNameId"
                                    options={inventoryNames}
                                    value={formData.inventoryNameId}
                                    onChange={handleChange}
                                    error={errors.inventoryNameId}
                                    createOption={createInventoryNameOption}
                                    onOptionCreated={(option) => setInventoryNames((prev) => [...prev, option])}
                                    schema={inventoryNameSchema}
                                    fieldKey="inventoryName"
                                    canCreate={hasPermission("create_inventory_name")}
                                    createTitle="Crear nombre de inventario"
                                    createLabel="Nombre del inventario"
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
                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <QuickCreateSelect
                                    label="Marca"
                                    name="brandId"
                                    options={brands}
                                    value={formData.brandId}
                                    onChange={handleChange}
                                    error={errors.brandId}
                                    createOption={createBrandOption}
                                    onOptionCreated={(option) => setBrands((prev) => [...prev, option])}
                                    schema={brandSchema}
                                    fieldKey="marca"
                                    canCreate={hasPermission("create_brand")}
                                    createTitle="Crear marca"
                                    createLabel="Nombre de la marca"
                                    createPlaceholder="Ej: Samsung"
                                />
                            </div>
                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <QuickCreateSelect
                                    label="Categoría"
                                    name="categoryId"
                                    options={categorias}
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    error={errors.categoryId}
                                    createOption={createCategoryOption}
                                    onOptionCreated={(option) => setCategorias((prev) => [...prev, option])}
                                    schema={categorySchema}
                                    fieldKey="categoryName"
                                    canCreate={hasPermission("create_category")}
                                    createTitle="Crear categoría"
                                    createLabel="Nombre de la categoría"
                                    createPlaceholder="Ej: Electrónica"
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
                                    {/* Fila 5 */}
                                    <div className="min-w-0">
                                        <h4>Ficha Técnica</h4>
                                        <FileInput
                                            value={formData.materialTechnicalSheet}
                                            onChange={(files) =>
                                                setFormData((prev) => ({ ...prev, materialTechnicalSheet: files }))
                                            }
                                            multiple={false}   // 👈 solo un archivo
                                        />
                                        {errors.materialTechnicalSheet && (
                                            <span className="text-red-500 text-sm">{errors.materialTechnicalSheet}</span>
                                        )}
                                    </div>

                                    {/* Contenedor del input */}
                                    <div className="min-w-0 flex-1">
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
                            </div>

                        </div>

                        {/* Acciones */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-1 w-full">
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

                    </form>

                    {exitModal}
                    <Modal
                        isOpen={isModalOpen}
                        title="Confirmar actualización de material de consumo"
                        onClose={() => {
                // Cancelar la confirmación también pregunta si de verdad
                // quiere salir, porque ya hay datos ingresados.
                setIsModalOpen(false);
                requestExit({ always: true });
            }}
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

