import { useState } from "react";
import { Input, Button, Select, Checkbox } from "@/shared";
import { consumibleSchema, devolutivoSchema } from "../schemas/returnSchema";
import { useNavigate } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Escogemos el schema según el tipo
    const schema =
      formData.materialType === "devolutivo"
        ? devolutivoSchema
        : consumibleSchema;

    // Validamos directamente el formData
    const result = schema.safeParse(formData);

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
    console.log("Devolución válida:", result.data);

    try {
      // Aquí ya puedes enviar al backend
      const response = await fetch("http://localhost:5000/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data);
      alert("Devolución creada correctamente");
      navigate(-1);
    } catch (err) {
      console.error("Error creando devolución:", err);
      alert("Error al crear devolución");
    }
  };
  let label;
  // 😂 lógica fuera del JSX
  if (isSubmitting) {
    label = "Creando...";
  } else {
    label = "Crear";
  }


  return (
    <div
      className="min-h-screen flex flex-col items-center py-10 px-4"
      style={{
        background:
          "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
        fontFamily: "var(--main-font)",
      }}
    >
      <header className="w-full max-w-6xl flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer"
        >
          <CircleArrowLeft size={36} color="#ffffff" />
        </button>

        <div className="flex-1 text-center">
          <h1 className="text-white text-2xl font-medium tracking-tight">
            Sistema Inventario de Infraestructura y
            <br />
            Teleinformática CDITI SENA
          </h1>
        </div>

        <div className="w-10" />
      </header>

      <div className="w-full max-w-4xl bg-white rounded-[28px] p-10 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_2px_6px_2px_rgba(0,0,0,0.15)]">
        <h2 className="text-3xl font-medium text-center text-gray-900">
          Crear Devolución de Material
        </h2>

        <p className="text-sm text-gray-500 text-center mt-2 mb-10">
          Selecciona el tipo de material y completa los campos
        </p>

        <div className="w-full md:w-80 mx-auto mb-10">
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              label="Descripción / Observaciones"
              name="returnDescription"
              value={formData.returnDescription}
              onChange={handleChange}
              error={errors.returnDescription || errors.observations}
            />

            <Input
              label="Cantidad Devuelta"
              name="returnQuantity"
              type="number"
              value={formData.returnQuantity}
              onChange={handleChange}
              error={errors.returnQuantity}
            />
          </div>

          <div className="flex flex-col items-center gap-5">
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
  );
}