import { useState } from "react";
import { Input, Button, Select, Navbar, FileInput } from "@/shared";
import { returnablematerialSchema } from "../schemas/returnablematerialSchema";
import { useNavigate } from "react-router-dom";
import { createReturnableMaterial } from "../services/returnableMaterialService";

export default function ReturnableMaterialRegisterForm() {
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



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convertimos valores numéricos antes de validar
    const parsedData = {
      ...formData,
      materialUnitValue: Number(formData.materialUnitValue),
      materialQuantity: Number(formData.materialQuantity),
      materialTotalValue: Number(formData.materialTotalValue),
    };

    // Validación con Zod
    const result = returnablematerialSchema.safeParse(parsedData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
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
      const response = await createReturnableMaterial(payload);

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

      <div className="flex flex-col flex-1 px-10 py-8 gap-4 justify-center">
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
          className="bg-white rounded-2xl flex flex-col gap-6 lg:w-6xl mx-auto"
          style={{ padding: "32px 36px" }}
        >
          <p
            style={{
              fontSize: "var(--fs-xxs)",
              color: "var(--color-gray-500)",
              margin: 0,
            }}
          >
            Completa los campos para registrar un nuevo material devolutivo
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 lg:mx-5 md:mx-2"
          >
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
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
              <Input
                label="Descripción"
                name="materialDescription"
                value={formData.materialDescription}
                onChange={handleChange}
                error={errors.materialDescription}
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
        </div>
      </div>
    </div>
  );
}
