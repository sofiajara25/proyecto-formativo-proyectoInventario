import { useEffect, useState } from "react";
import { Input, Button, Select, Checkbox, Navbar, Modal, TextArea } from "@/shared";
import { returnSchema } from "../schemas/returnSchema";
import { useNavigate } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";
import { createReturn } from "../services/returnService";
import { getLoans } from "../../loans/services/loanService";

export default function ReturnForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Un solo estado compartido: los campos no se pierden ni se reinician
  // al cambiar entre Devolutivo y Consumible.
  const [formData, setFormData] = useState({
    materialType: "",
    loanId: "",
    loanItemId: "",
    returnDate: "",
    returnDescription: "",
    returnQuantity: "",
    isAvailable: true,
    isMaintenance: false,
    isLow: false,
  });

  const [errors, setErrors] = useState({});

  const [loans, setLoans] = useState([]);

  // Fecha de hoy en formato YYYY-MM-DD usando la zona horaria local
  // (evita el corrimiento de un día que da new Date().toISOString()).
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const localToday = `${yyyy}-${mm}-${dd}`;

  // Opciones del select definidas afuera
  // Solo préstamos vigentes (is_active): uno ya devuelto no debería
  // aparecer aquí de nuevo (el backend además lo rechaza si se intenta).
  // Un préstamo puede tener varios materiales (ej. "Escritorio" + "Sillas"
  // en el mismo préstamo); "product_name" en loans solo guarda el primero
  // como respaldo, así que si el select lo usara solo, el resto de
  // materiales del mismo préstamo "desaparecerían" de la lista. Usamos el
  // arreglo "materials" completo para armar la etiqueta.
  const loanOptions = [
    { id: "", label: "Seleccionar una opción" }, // opción inicial
    ...loans
      .filter((l) => l.is_active)
      .map((l) => {
        const names = Array.isArray(l.materials) && l.materials.length
          ? l.materials.map((m) => m.product_name).join(", ")
          : l.product_name;
        return {
          id: l.loan_id,
          label: `${names} - ${l.loan_user}`,
        };
      }),
  ];

  const Options = [
    { id: "", label: "Seleccionar una opción" }, // opción inicial
    { id: "devolutivo", label: "Devolutivo" },
    { id: "consumible", label: "Consumible" },
  ];

  useEffect(() => {
    getLoans()
      .then((data) => setLoans(data))
      .catch((err) => console.error("Error cargando préstamos:", err));
  }, []);

  // Materiales del préstamo elegido que todavía NO se han devuelto (un
  // préstamo con "Escritorio" + "Sillas" ya devuelto solo debe seguir
  // ofreciendo "Sillas").
  const selectedLoan = loans.find((l) => String(l.loan_id) === String(formData.loanId));
  const pendingMaterials = (selectedLoan?.materials || []).filter((m) => !m.returned);
  const materialOptions = [
    { id: "", label: "Seleccionar una opción" },
    ...pendingMaterials.map((m) => ({
      id: String(m.id),
      label: `${m.product_name} (cantidad: ${m.quantity})`,
    })),
  ];

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

  // El tipo de material de la devolución no es una elección libre: depende
  // de qué tipo de préstamo es (un préstamo "Devolutivo" solo puede tener
  // materiales devolutivos prestados, y uno "Consumo" solo consumibles).
  // Antes era un select aparte que el usuario podía dejar sin relación con
  // el préstamo elegido.
  function materialTypeForLoan(loan) {
    if (loan?.material_type === "Devolutivo") return "devolutivo";
    if (loan?.material_type === "Consumo") return "consumible";
    return "";
  }

  // Al cambiar de préstamo, el material elegido antes ya no aplica (era de
  // otro préstamo): limpiamos material y cantidad para no dejar una
  // combinación inconsistente. El tipo de material se recalcula solo, a
  // partir del préstamo elegido.
  const handleLoanChange = (e) => {
    const { value } = e.target;
    const loan = loans.find((l) => String(l.loan_id) === String(value));
    setFormData((prev) => ({
      ...prev,
      loanId: value,
      loanItemId: "",
      returnQuantity: "",
      materialType: materialTypeForLoan(loan),
    }));
  };

  // Al elegir el material, precargamos la cantidad devuelta con la cantidad
  // que se prestó de ESE material (no se puede editar: la devolución es del
  // ítem completo, no de una cantidad parcial).
  const handleMaterialChange = (e) => {
    const { value } = e.target;
    const chosen = pendingMaterials.find((m) => String(m.id) === String(value));
    setFormData((prev) => ({
      ...prev,
      loanItemId: value,
      returnQuantity: chosen?.quantity ?? "",
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

          {/* Datos del préstamo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <Select
              label="Tipo de Material"
              name="materialType"
              value={formData.materialType}
              onChange={handleChange}
              options={
                formData.materialType
                  ? Options
                  : [{ id: "", label: "Selecciona un préstamo primero" }]
              }
              error={errors.materialType}
              disabled
            />
            <Select
              label="Préstamo"
              name="loanId"
              value={formData.loanId}
              onChange={handleLoanChange}
              options={loanOptions}
            />

            <Select
              label="Material a devolver"
              name="loanItemId"
              value={formData.loanItemId}
              onChange={handleMaterialChange}
              options={
                formData.loanId
                  ? materialOptions
                  : [{ id: "", label: "Primero selecciona un préstamo" }]
              }
              error={errors.loanItemId}
            />

            <Input
              label="Fecha de Devolución"
              name="returnDate"
              type="date"
              value={formData.returnDate}
              onChange={handleChange}
              error={errors.returnDate}
              min={localToday}
            />

            <Input
              label="Cantidad Devuelta"
              name="returnQuantity"
              type="number"
              min="0"
              value={formData.returnQuantity}
              onChange={handleChange}
              error={errors.returnQuantity}
              disabled
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