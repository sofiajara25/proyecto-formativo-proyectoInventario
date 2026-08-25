import { useState } from "react";
import { Input, Button, Select, Navbar, FileInput, Modal, TextArea, PageLayout } from "@/shared";
import { updateReturnableSchema } from "../schemas/updateReturnableSchema";
import { useNavigate, useParams } from "react-router-dom";
import { getReturnableById, updateReturnable } from "../services/returnableMaterialService";
import { getCategorys } from "../../categorys/service/categoryService";
import { QuotationsPicker } from "../../quotations";
import { useEffect } from "react";

export default function ReturnableMaterialRegisterForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    materialToolId: "",
    materialSenaPlate: "",
    categoryId: "",
    materialSerial: "",
    materialName: "",
    materialModel: "",
    materialUnitValue: "",
    materialCustodian: "",
    materialQuantity: "",
    materialStatus: "",
    materialTotalValue: "",
    materialDimensions: "",
    materialDescription: "",
    materialTechnicalSheet: [],
    inventoryNameId: "",
    materialLocation: "",
    brandId: "",
    quotationIds: [],
    photo: [],
  });

  const [errors, setErrors] = useState({});

  const [brands, setBrands] = useState([]);

  const [inventoryNames, setInventoryNames] = useState([]);

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    getCategorys()
      .then((data) => {
        const options = data.map((c) => ({
          value: c.category_id,
          label: `${c.category_name} (${c.element_type})`,
        }));
        setCategorias([{ value: "", label: "Seleccione una opción" }, ...options]);
      })
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

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
        const options = data.map(n => ({ value: n.inventory_name_id, label: n.inventory_name }));
        setInventoryNames([{ value: "", label: "Selecciona un nombre de inventario" }, ...options]);
      })
      .catch(err => console.error("Error cargando nombre de inventarios:", err));
  }, []);

  const estados = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
  ];

  const { id } = useParams();

  useEffect(() => {
    getReturnableById(id)
      .then((data) => setFormData({
        materialToolId: data.tool_id,
        materialSenaPlate: data.sena_plate,
        categoryId: data.category_id ?? "",
        materialSerial: data.serial,
        materialName: data.material_name,
        materialModel: data.model,
        materialUnitValue: data.unit_value,
        materialCustodian: data.custodian,
        materialQuantity: data.quantity,
        materialStatus: data.status,
        materialTotalValue: data.total_value,
        materialDimensions: data.dimensions,
        materialDescription: data.description,
        // Precargamos el archivo/foto ya guardados para que se vean en el
        // formulario y el usuario sepa qué va a reemplazar. Si no toca el
        // campo, se conservan tal cual.
        materialTechnicalSheet: data.technical_sheet ? [data.technical_sheet] : [],
        // El schema espera un string ("z.string()"), pero el backend
        // devuelve el id como número: si no se convierte, la validación
        // falla con "Invalid input: expected string, received number" en
        // cuanto el usuario guarda sin tocar este campo.
        inventoryNameId: data.inventory_name_id != null ? String(data.inventory_name_id) : "",
        materialLocation: data.location,
        // Si no hay marca asignada, el backend devuelve null. El <select>
        // de React no acepta "value={null}" (advertencia en consola), así
        // que caemos a "" para que se vea la opción "Selecciona una marca".
        brandId: data.brand_id ?? "",
        quotationIds: Array.isArray(data.quotations)
          ? data.quotations.map((q) => q.quotation_id)
          : [],
        // El backend devuelve "photos" con TODAS las fotos (portada +
        // galería). Si por algún motivo no viene, caemos a mostrar solo la
        // portada.
        photo: Array.isArray(data.photos)
          ? data.photos
          : (data.photo_url ? [data.photo_url] : []),
      }))
      .catch((err) => console.error("Error cargando material:", err));
  }, [id]);

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



  const handleSubmit = async () => {
    setIsSubmitting(true);

    const parsedData = {
      ...formData,
      // Si no hay marca seleccionada, null (no 0): brandId=0 no existe
      // en la tabla brands y rompe la llave foránea.
      brandId: formData.brandId ? Number(formData.brandId) : null,
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      materialUnitValue: Number(formData.materialUnitValue),
      materialQuantity: Number(formData.materialQuantity),
      materialTotalValue: Number(formData.materialTotalValue),
    };

    const result = updateReturnableSchema.safeParse(parsedData);
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
      const response = await updateReturnable(id, result.data);
      console.log("Material actualizado:", response);
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
    label = "Actualizar Material Devolutivo";
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

      <div className="flex flex-col flex-1 px-10 py-2 gap-2 justify-center">
        {/* Título */}
        <h1
          className="lg:pl-[70px]"
          style={{
            color: "var(--color-white)",
            fontSize: "var(--fs-md)",
            fontWeight: "var(--font-weight-bold)",
            margin: 0,
          }}
        >
          Actualizar Material Devolutivo
        </h1>

        {/* Card */}
        <div
          className="bg-white rounded-2xl flex flex-col gap-2 lg:w-6xl mx-auto"
          style={{ padding: "14px" }}
        >

          <form
            onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }}
            className="flex flex-col gap-1 lg:mx-5 md:mx-2"
          >
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2">
              {/* Fila 1 */}
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
              <Select
                label={<span>Categoria <span style={{ color: "red" }}>*</span></span>}
                name="categoryId"
                options={categorias}
                value={formData.categoryId}
                onChange={handleChange}
                error={errors.categoryId}
              />
              <Input
                label="Serial Number (SN)"
                name="materialSerial"
                value={formData.materialSerial}
                onChange={handleChange}
                error={errors.materialSerial}
              />

              {/* Fila 2 */}
              <Input
                label="Nombre del Material"
                name="materialName"
                value={formData.materialName}
                onChange={handleChange}
                error={errors.materialName}
              />
              <Input
                label="Modelo"
                name="materialModel"
                value={formData.materialModel}
                onChange={handleChange}
                error={errors.materialModel}
              />
              <Input
                label="Valor Unitario"
                name="materialUnitValue"
                type="number"
                value={formData.materialUnitValue}
                onChange={handleChange}
                error={errors.materialUnitValue}
              />

              {/* Fila 3 */}
              <Input
                label="Cuentadante"
                name="materialCustodian"
                value={formData.materialCustodian}
                onChange={handleChange}
                error={errors.materialCustodian}
              />
              <Input
                label="Cantidad"
                name="materialQuantity"
                type="number"
                value={formData.materialQuantity}
                onChange={handleChange}
                error={errors.materialQuantity}
              />
              <Select
                label="Estado"
                name="materialStatus"
                options={estados}
                value={formData.materialStatus}
                onChange={handleChange}
                error={errors.materialStatus}
              />

              {/* Fila 4 */}
              <Input
                label="Valor Total"
                name="materialTotalValue"
                type="number"
                value={formData.materialTotalValue}
                onChange={handleChange}
                error={errors.materialTotalValue}
              />
              <Input
                label="Dimensiones"
                name="materialDimensions"
                value={formData.materialDimensions}
                onChange={handleChange}
                error={errors.materialDimensions}
              />
              <TextArea
                label="Descripción"
                name="materialDescription"
                value={formData.materialDescription}
                onChange={handleChange}
                error={errors.materialDescription}
                rows={1}
              />
              <Select
                label="Marca"
                name="brandId"
                options={brands}
                value={formData.brandId}
                onChange={handleChange}
                error={errors.brandId}
              />
              <Select
                label="Nombre de inventario"
                name="inventoryNameId"
                options={inventoryNames}
                value={formData.inventoryNameId}
                onChange={handleChange}
                error={errors.inventoryNameId}
              />
              <Input
                label="Ubicación"
                name="materialLocation"
                value={formData.materialLocation}
                onChange={handleChange}
                error={errors.materialLocation}
              />
              <div className="min-w-0">
                <QuotationsPicker
                  value={formData.quotationIds}
                  onChange={(ids) => setFormData((prev) => ({ ...prev, quotationIds: ids }))}
                  error={errors.quotationIds}
                />
              </div>

              {/* Ficha Técnica y Foto quedan como celdas normales del grid,
                  justo al lado de Ubicación, en vez de un bloque aparte
                  mucho más abajo. */}
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

              <div className="min-w-0">
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
            <div className="flex justify-end gap-3 pt-2">
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
            title="Confirmar actualización de material devolutivo"
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleSubmit}
            confirmText="Actualizar"
            cancelText="Cancelar"
          >
            <p>¿Seguro que deseas actualizar este material devolutivo?</p>
          </Modal>

        </div>
      </div>
    </div>
  );
}
