import { useState } from "react";
import { Input, Button, Select, Navbar, FileInput, Modal, TextArea } from "@/shared";
import { returnablematerialSchema } from "../schemas/returnablematerialSchema";
import { useNavigate } from "react-router-dom";
import { createReturnableMaterial } from "../services/returnableMaterialService";

export default function ReturnableMaterialRegisterForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    materialToolId: "",
    materialSenaPlate: "",
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
    materialTechnicalSheet: "",
    materialLocation: "",
    photo: [],
  });

  const [errors, setErrors] = useState({});

  const estados = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };



  const handleSubmit = async () => {
    setIsSubmitting(true);

    const parsedData = {
      ...formData,
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
      const payload = {
        ...result.data,
        photo: result.data.photo?.[0]?.name ?? null,
      };
      const response = await createReturnableMaterial(payload);
      console.log("Material creado:", response);
      alert("Material creado correctamente");
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
          Crear Material Devolutivo
        </h1>

        {/* Card */}
        <div
          className="bg-white rounded-2xl flex flex-col gap-2 lg:w-6xl mx-auto"
          style={{ padding: "12px" }}
        >

          <form
            onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }}
            className="flex flex-col gap-2 lg:mx-5 md:mx-2"
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
              <Input
                label="Serial"
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

              {/* Fila 5 */}
              <Input
                label="Ficha Técnica"
                name="materialTechnicalSheet"
                value={formData.materialTechnicalSheet}
                onChange={handleChange}
                error={errors.materialTechnicalSheet}
              />
              <Input
                label="Ubicación"
                name="materialLocation"
                value={formData.materialLocation}
                onChange={handleChange}
                error={errors.materialLocation}
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
