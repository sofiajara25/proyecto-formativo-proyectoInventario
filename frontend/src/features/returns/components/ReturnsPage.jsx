import { useState } from "react";
import { Input, Button, Select, Checkbox } from "@/shared";
import { returnSchema } from "../schemas/returnSchema";
import { useNavigate } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";
import { createReturn } from "../services/returnService";

export default function ReturnForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Un solo estado compartido: los campos no se pierden ni se reinician
  // al cambiar entre Devolutivo y Consumible.
  const [formData, setFormData] = useState({
    materialType: "",
    loanId: "",
    returnDate: "",
    returnDescription: "",
    returnQuantity: "",
    isAvailable: true,
    isMaintenance: false,
    isLow: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  // 🔹 handleSubmit simplificado con isSubmitting
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = returnSchema.safeParse(formData);

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
    console.log("Devolución válida:", result.data);

    try {
      // Llamamos al servicio frontend que consume la API
      // result.data contiene los datos ya validados por Zod
      const response = await createReturn(result.data);

      // Log informativo para desarrollo
      console.log("Retorno creado:", response);

      // Feedback básico al usuario
      alert("Retorno creado correctamente");

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
    label = "Crear retorno";
  }

  return (
    <div
      className="min-h-screen flex flex-col py-6 px-4"
      style={{
        background:
          "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
        fontFamily: "var(--main-font)",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer mb-6"
      >
        <CircleArrowLeft size={28} color="#ffffff" />
      </button>

      <div className="flex justify-center mb-8">
        <h1 className="text-white text-2xl font-medium tracking-tight text-center">
          Sistema Inventario de Infraestructura y
          <br />
          Teleinformática CDITI SENA
        </h1>
      </div>

      <div className="w-full max-w-3xl mx-auto bg-white rounded-[28px] p-8">
        <h2 className="text-2xl font-medium text-center text-gray-900">
          Crear Devolución de Material
        </h2>

        <p className="text-sm text-gray-500 text-center mt-2 mb-8">
          Selecciona el tipo de material y completa los campos
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Tipo de material: campo destacado, separado del resto */}
          <div className="flex justify-center pb-6 border-b border-gray-200">
            <Select
              label="Tipo de Material"
              name="materialType"
              value={formData.materialType}
              onChange={handleChange}
              options={[
                { id: "devolutivo", label: "Devolutivo" },
                { id: "consumible", label: "Consumible" },
              ]}
              error={errors.materialType}
            />
          </div>

          {/* Datos del préstamo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="ID del Préstamo"
              name="loanId"
              value={formData.loanId}
              onChange={handleChange}
              error={errors.loanId}
            />

            <Input
              label="Fecha de Devolución"
              name="returnDate"
              type="date"
              value={formData.returnDate}
              onChange={handleChange}
              error={errors.returnDate}
            />

            <Input
              label="Cantidad Devuelta"
              name="returnQuantity"
              type="number"
              min="0"
              value={formData.returnQuantity}
              onChange={handleChange}
              error={errors.returnQuantity}
            />

            <div className="md:col-span-1">
              <Input
                label="Descripción / Observaciones"
                name="returnDescription"
                value={formData.returnDescription}
                onChange={handleChange}
                error={errors.returnDescription || errors.observations}
              />
            </div>
          </div>

          {/* Estado del material */}
          <div className="flex flex-col items-center gap-5 pt-2 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">
              Estado del material
            </h3>

            <div className="flex flex-wrap justify-center gap-6">
              <Checkbox
                id="isAvailable"
                name="isAvailable"
                label="Disponible"
                checked={formData.isAvailable}
                onChange={handleChange}
              />

              <Checkbox
                id="isMaintenance"
                name="isMaintenance"
                label="Mantenimiento"
                checked={formData.isMaintenance}
                onChange={handleChange}
              />

              <Checkbox
                id="isLow"
                name="isLow"
                label="Baja"
                checked={formData.isLow}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isSubmitting}
            >
              {label}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}