import { useState } from "react";
import { Button, Navbar, Modal } from "@/shared";
import { useNavigate } from "react-router-dom";
// Si tienes un schema con Zod para marca
import { brandSchema } from "../schemas/brandsSchema";
import { createBrand } from "../service/brandService";

export default function BrandRegisterForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    marca: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async () => {
    setIsSubmitting(true);

    const result = brandSchema.safeParse(formData);
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
      const payload = result.data;
      const response = await createBrand(payload);
      console.log("Marca creada:", response);
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
    label = "Crear Marca";
  }


  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}>
      <Navbar />
      <div className="flex flex-col flex-1 px-10 py-8 gap-4 justify-center">
        {/* Título y tarjeta comparten el mismo ancho máximo y quedan
            centrados juntos, así el título siempre queda a la par del
            borde izquierdo de la tarjeta sin importar el tamaño de
            pantalla (antes se usaba un marginLeft fijo en px que solo
            calzaba en una resolución específica). */}
        <div className="w-full max-w-md mx-auto flex flex-col gap-4">
          <h1 style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0 }}>
            Crear Marca
          </h1>
          <div className="bg-white rounded-2xl flex flex-col gap-6 w-full shadow justify-center items-center" style={{ padding: "32px 36px" }}>
            <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-gray-500)" }}>
              Completa el campo para registrar una nueva marca
            </p>
            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="flex flex-col gap-6 w-full">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="marca">
                  Nombre de la marca
                </label>
                <input
                  id="marca"
                  name="marca"
                  type="text"
                  placeholder="Ej: Samsung"
                  value={formData.marca}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400 ${errors.marca ? "border-red-400" : ""}`}
                />
                {errors.marca && <p className="text-red-500 text-xs mt-1">{errors.marca}</p>}
              </div>
              {/* Acciones */}
              <div className="flex flex-wrap justify-end gap-3 pt-2 w-full">
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
              title="Confirmar creación de marca"
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleSubmit}
              confirmText="Crear"
              cancelText="Cancelar"
            >
              <p>¿Seguro que deseas crear esta marca?</p>
            </Modal>

          </div>
        </div>
      </div>
    </div>
  );
}
