import { useState, useCallback } from "react";
import { Input, Button, Select, Checkbox, Navbar, Modal, TextArea } from "@/shared";
import { useNavigate, useParams } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";
import { updateReturn, getReturnById } from "../services/returnService";
import { useEffect } from "react";
import { getLoans } from "../../loans/services/loanService";
import { updateReturnSchema } from "../schemas/updateReturnSchema";
import { showAlert, showSuccessAndThen } from "@/shared/utils/alertBus";
import { useFormExitGuard } from "@/shared/hooks/useFormExitGuard";

export default function ReturnForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Un solo estado compartido: los campos no se pierden ni se reinician
  // al cambiar entre Devolutivo y Consumible.
  const [formData, setFormData] = useState({
    materialType: "",
    loanId: "",
    // A qué material puntual del préstamo corresponde esta devolución. Se
    // fija al crear el retorno y no se puede cambiar aquí (el backend no lo
    // permite: cambiarlo significaría mover el stock ya devuelto a otro
    // material), así que este campo se muestra pero deshabilitado.
    loanItemId: "",
    returnDate: "",
    returnDescription: "",
    returnQuantity: "",
    status: "Disponible",
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

  const { id } = useParams();

  useEffect(() => {
    getReturnById(id)
      .then((data) => setLoadedData({
        materialType: data.material_type,
        loanId: data.loan_id,
        loanItemId: data.loan_item_id ?? "",
        returnDate: data.return_date?.slice(0, 10) || "",
        returnDescription: data.description,
        returnQuantity: data.quantity,
        status: data.status,
      }))
      .catch((err) => console.error("Error cargando material:", err));
  }, [id, setLoadedData]);

  const [loans, setLoans] = useState([]);

  // Un préstamo puede tener varios materiales; "product_name" en loans solo
  // guarda el primero como respaldo, así que usamos el arreglo "materials"
  // completo para armar la etiqueta (mismo criterio que en el crear).
  const loanOptions = [
    { id: "", label: "Seleccionar una opción" }, // opción inicial
    ...loans.map((l) => {
      const names = Array.isArray(l.materials) && l.materials.length
        ? l.materials.map((m) => m.product_name).join(", ")
        : l.product_name;
      return { id: l.loan_id, label: `${names} - ${l.loan_user}` };
    }),
  ];

  // Material puntual vinculado a este retorno, solo para mostrarlo (no se
  // puede editar aquí).
  const selectedLoan = loans.find((l) => String(l.loan_id) === String(formData.loanId));
  const materialOptions = [
    { id: "", label: "Sin material vinculado" },
    ...(selectedLoan?.materials || []).map((m) => ({
      id: String(m.id),
      label: `${m.product_name} (cantidad: ${m.quantity})`,
    })),
  ];

  const Options = [
    { id: "", label: "Seleccionar una opción" }, // opción inicial
    { id: "devolutivo", label: "Devolutivo" },
    { id: "consumible", label: "Consumible" },
  ];

  // Antes eran 3 checkboxes independientes; ahora es un solo estado real.
  const statusOptions = [
    { id: "Disponible", label: "Disponible" },
    { id: "Mantenimiento", label: "Mantenimiento" },
    { id: "Baja", label: "Baja" },
  ];

  useEffect(() => {
    getLoans()
      .then((data) => setLoans(data))
      .catch((err) => console.error("Error cargando préstamos:", err));
  }, []);


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

    const result = updateReturnSchema.safeParse(formData);
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
      const response = await updateReturn(id, result.data);
      console.log("Retorno actualizado:", response);
      showSuccessAndThen("Devolución actualizada con éxito", () => navigate(-1));
    } catch (error) {
      console.error("Error:", error.message);
      showAlert(error.message, { type: "error" });
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };


  let label;
  // 😂 lógica fuera del JSX
  if (isSubmitting) {
    label = "Actualizando...";
  } else {
    label = "Actualizar retorno";
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

      <div className="w-full max-w-3xl mx-auto bg-white rounded-[28px] p-6 mt-2">
        <h2 className="text-2xl font-medium text-center text-gray-900">
          Actualizar Devolución de Material
        </h2>


        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="flex flex-col gap-8">

          {/* Datos del préstamo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <Select
              label="Tipo de Material"
              name="materialType"
              value={formData.materialType}
              onChange={handleChange}
              options={Options}
              error={errors.materialType}
            />
            <Select
              label="Préstamo"
              name="loanId"
              value={formData.loanId}
              onChange={handleChange}
              options={loanOptions}
            />

            <Select
              label="Material a devolver"
              name="loanItemId"
              value={formData.loanItemId ? String(formData.loanItemId) : ""}
              onChange={() => {}}
              options={materialOptions}
              disabled
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

            {/* Se ve como los 3 checkboxes de antes, pero solo uno puede
                quedar marcado a la vez: al marcar uno, los otros dos se
                desmarcan solos (el dato real sigue siendo un único
                "status", no 3 booleanos independientes). */}
            <div className="flex flex-wrap justify-center gap-6">
              {statusOptions.map((opt) => (
                <Checkbox
                  key={opt.id}
                  id={opt.id}
                  name="status"
                  label={opt.label}
                  checked={formData.status === opt.id}
                  onChange={() => setFormData((prev) => ({ ...prev, status: opt.id }))}
                />
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => requestExit()}
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
        {exitModal}
        <Modal
          isOpen={isModalOpen}
          title="Confirmar actualización de retorno"
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
          <p>¿Seguro que deseas actualizar este retorno?</p>
        </Modal>

      </div>
    </div>
  );
}