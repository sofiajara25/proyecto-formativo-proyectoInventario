import { useState } from "react";
import { Input, Button, Select, Checkbox, Navbar, Modal, TextArea } from "@/shared";
import { returnSchema } from "../schemas/returnSchema";
import { useNavigate } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";
import { createReturn } from "../services/returnService";

export default function ReturnForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const handleSubmit = async () => {
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
    try {
      const response = await createReturn(result.data);
      console.log("Retorno creado:", response);
      alert("Retorno creado correctamente");
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
  // 😂 lógica fuera del JSX
  if (isSubmitting) {
    label = "Creando...";
  } else {
    label = "Crear retorno";
  }

  return (
    <div
      className="min-h-screen flex flex-col "
      style={{
        background:
          "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
        fontFamily: "var(--main-font)",
      }}
    >
      <Navbar />

      <div className="w-full max-w-3xl mx-auto bg-white rounded-[28px] p-6 mt-2">
        <h2 className="text-2xl font-medium text-center text-gray-900">
          Crear Devolución de Material
        </h2>

        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="flex flex-col gap-8">
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
              <TextArea
                label="Descripción / Observaciones"
                name="returnDescription"
                value={formData.returnDescription}
                onChange={handleChange}
                error={errors.returnDescription || errors.observations}
                rows={1}
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
        <Modal
          isOpen={isModalOpen}
          title="Confirmar creación de retorno"
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSubmit}
          confirmText="Crear"
          cancelText="Cancelar"
        >
          <p>¿Seguro que deseas crear este retorno?</p>
        </Modal>

      </div>
    </div>
  );
}