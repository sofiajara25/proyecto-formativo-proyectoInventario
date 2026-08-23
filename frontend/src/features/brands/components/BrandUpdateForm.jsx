import { useState, useEffect } from "react";
import { Button, Navbar, Modal } from "@/shared";
import { useNavigate, useParams } from "react-router-dom";
import { brandSchema } from "../schemas/brandsSchema";
import { getBrandById, updateBrand } from "../service/brandService";

export default function UpdateBrandPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({ marca: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar marca existente
  useEffect(() => {
    getBrandById(id)
      .then((brand) => setFormData({ marca: brand.marca }))
      .catch((err) => console.error("Error cargando marca:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const result = brandSchema.safeParse(formData);
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
      await updateBrand(id, result.data);
      navigate(-1);
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}>
      <Navbar />
      <div className="flex flex-col flex-1 px-10 py-8 gap-4 justify-center">
        {/* Título y tarjeta comparten el mismo ancho máximo y quedan
            centrados juntos, así el título siempre queda a la par del
            borde izquierdo de la tarjeta sin importar el tamaño de
            pantalla. */}
        <div className="w-full max-w-md mx-auto flex flex-col gap-4">
          <h1 style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0 }}>
            Actualizar Marca
          </h1>
          <div className="bg-white rounded-2xl flex flex-col gap-6 w-full shadow justify-center items-center" style={{ padding: "32px 36px" }}>
            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="flex flex-col gap-6 w-full">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="marca">
                  Nombre de la marca
                </label>
                <input
                  id="marca"
                  name="marca"
                  type="text"
                  value={formData.marca}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400 ${errors.marca ? "border-red-400" : ""}`}
                />
                {errors.marca && <p className="text-red-500 text-xs mt-1">{errors.marca}</p>}
              </div>
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" size="md" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Actualizar"}
                </Button>
              </div>
            </form>
            <Modal
              isOpen={isModalOpen}
              title="Confirmar actualización de marca"
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleSubmit}
              confirmText="Actualizar"
              cancelText="Cancelar"
            >
              <p>¿Seguro que deseas actualizar esta marca?</p>
            </Modal>

          </div>
        </div>
      </div>
    </div>
  );
}
