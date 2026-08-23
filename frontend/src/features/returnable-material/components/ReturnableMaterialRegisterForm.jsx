import { useEffect, useState } from "react";
import { Input, Button, Select, Navbar, FileInput, Modal, TextArea } from "@/shared";
import { returnablematerialSchema } from "../schemas/returnablematerialSchema";
import { useNavigate } from "react-router-dom";
import { createReturnableMaterial, getNextReturnableToolId } from "../services/returnableMaterialService";

export default function ReturnableMaterialRegisterForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    materialSenaPlate: "",
    materialCategory: "",
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
    photo: [],
  });

  const [errors, setErrors] = useState({});

  const [brands, setBrands] = useState([]);

  const [inventoryNames, setInventoryNames] = useState([]);


  // Vista previa del ID que el backend le va a asignar al material al
  // guardarlo (ej. "DEV-0007"). No se puede editar, solo se muestra.
  const [nextToolId, setNextToolId] = useState("Calculando...");

  const categorias = [
    { value: "", label: "Seleccione una opcion" },
    { value: "herramienta", label: "Herramienta" },
    { value: "equipo", label: "Equipo" },
    { value: "muebles", label: "Muebles y enseres" },
  ];

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
    getNextReturnableToolId()
      .then(setNextToolId)
      .catch((err) => {
        console.error("Error obteniendo el próximo ID:", err);
        setNextToolId("Se generará automáticamente");
      });
  }, []);

  const estados = [
    { value: "", label: "Selecciona una opción" },
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
  ];

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
      // Si no se seleccionó marca, enviamos null (no 0): brandId=0 no
      // existe en la tabla brands y rompe la llave foránea.
      brandId: formData.brandId ? Number(formData.brandId) : null,
      materialUnitValue: Number(formData.materialUnitValue),
      materialQuantity: Number(formData.materialQuantity),
      materialTotalValue: Number(formData.materialTotalValue),
    };

    const result = returnablematerialSchema.safeParse(parsedData);
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
      const response = await createReturnableMaterial(result.data);
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
    label = "Crear Material Devolutivo";
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

      <div className="flex flex-col flex-1 px-10 py-0 gap-0 justify-center">
        <h1
          className="lg:pl-[70px]"
          style={{
            color: "var(--color-white)",
            fontSize: "var(--fs-md)",
            fontWeight: "var(--font-weight-bold)",
            margin: 0,
          }}
        >
          Crear Material Devolutivo
        </h1>

        <div
          className="bg-white rounded-2xl flex flex-col gap-0 lg:w-6xl mx-auto"
          style={{ padding: "6px" }}
        >
          <form
            onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }}
            className="flex flex-col gap-1 lg:mx-5 md:mx-2"
          >
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-1">

              {/* Fila 1 — Identificadores del bien */}
              {/* El ID Herramienta se muestra pero no es editable: el backend
                  lo genera automáticamente al crear el registro. Aquí solo
                  mostramos una vista previa del valor. */}
              <Input
                label="ID Herramienta"
                name="materialToolId"
                value={nextToolId}
                disabled
                readOnly
              />
              <Input
                label={<span>Placa SENA <span style={{ color: "red" }}>*</span></span>}
                name="materialSenaPlate"
                value={formData.materialSenaPlate}
                onChange={handleChange}
                error={errors.materialSenaPlate}
              />
              <Select
                label={<span>Categoria <span style={{ color: "red" }}>*</span></span>}
                name="materialCategory"
                options={categorias}
                value={formData.materialCategory}
                onChange={handleChange}
                error={errors.materialCategory}
              />
              <Input
                label="Serial Number (SN)"
                name="materialSerial"
                value={formData.materialSerial}
                onChange={handleChange}
                error={errors.materialSerial}
              />

              {/* Fila 2 — Datos del producto */}
              <Input
                label={<span>Nombre del Material <span style={{ color: "red" }}>*</span></span>}
                name="materialName"
                value={formData.materialName}
                onChange={handleChange}
                error={errors.materialName}
              />
              <Select
                label="Marca"
                name="brandId"
                options={brands}
                value={formData.brandId}
                onChange={handleChange}
                error={errors.brandId}
              />
              <Input
                label="Modelo"
                name="materialModel"
                value={formData.materialModel}
                onChange={handleChange}
                error={errors.materialModel}
              />

              {/* Fila 3 — Cantidades y valores */}
              <Input
                label={<span>Cantidad <span style={{ color: "red" }}>*</span></span>}
                name="materialQuantity"
                type="number"
                value={formData.materialQuantity}
                onChange={handleChange}
                error={errors.materialQuantity}
              />
              <Input
                label={<span>Valor Unitario <span style={{ color: "red" }}>*</span></span>}
                name="materialUnitValue"
                type="number"
                value={formData.materialUnitValue}
                onChange={handleChange}
                error={errors.materialUnitValue}
              />
              <Input
                label={<span>Valor Total <span style={{ color: "red" }}>*</span></span>}
                name="materialTotalValue"
                type="number"
                value={formData.materialTotalValue}
                onChange={handleChange}
                error={errors.materialTotalValue}
              />

              {/* Fila 4 — Gestión / asignación */}
              <Input
                label={<span>Cuentadante <span style={{ color: "red" }}>*</span></span>}
                name="materialCustodian"
                value={formData.materialCustodian}
                onChange={handleChange}
                error={errors.materialCustodian}
              />
              <Select
                label={<span>Nombre de inventario<span style={{ color: "red" }}>*</span></span>}
                name="inventoryNameId"
                options={inventoryNames}
                value={formData.inventoryNameId}
                onChange={handleChange}
                error={errors.inventoryNameId}
              />
              <Select
                label={<span>Estado <span style={{ color: "red" }}>*</span></span>}
                name="materialStatus"
                options={estados}
                value={formData.materialStatus}
                onChange={handleChange}
                error={errors.materialStatus}
              />

              {/* Fila 5 — Detalles */}
              <Input
                label="Dimensiones"
                name="materialDimensions"
                value={formData.materialDimensions}
                onChange={handleChange}
                error={errors.materialDimensions}
              />
              <TextArea
                label={<span>Descripción <span style={{ color: "red" }}>*</span></span>}
                name="materialDescription"
                value={formData.materialDescription}
                onChange={handleChange}
                error={errors.materialDescription}
                rows={1}
              />

              {/* Fila 6 — Ubicación queda junto a Ficha Técnica y Foto,
                  en vez de que estas queden muy abajo separadas del resto. */}
              <Input
                label="Ubicación"
                name="materialLocation"
                value={formData.materialLocation}
                onChange={handleChange}
                error={errors.materialLocation}
              />
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
              <div className="min-w-0">
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

            <div className="flex justify-end gap-3 pt-1">
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
            title="Confirmar creación de material devolutivo"
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleSubmit}
            confirmText="Crear"
            cancelText="Cancelar"
          >
            <p>¿Seguro que deseas crear este material devolutivo?</p>
          </Modal>
        </div>
      </div>
    </div>
  );
}