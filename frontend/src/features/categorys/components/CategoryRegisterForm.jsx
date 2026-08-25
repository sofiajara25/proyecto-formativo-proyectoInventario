import { useState } from "react";
import { Button, Navbar, Modal, Select, Input } from "@/shared";
import { useNavigate } from "react-router-dom";
import { categorySchema } from "../schemas/categorysSchema";
import { createCategory } from "../service/categoryService";
// Si tienes un schema con Zod para marca

export default function CategoryRegisterForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        categoryElementType: "",
        categoryName: ""
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const tipoElemento = [
        { value: "", label: "Selecciona una opción" },
        { value: "Herramientas", label: "Herramientas" },
        { value: "Muebles y Enseres", label: "Muebles y Enseres" },
        { value: "Equipo y Maquinar", label: "Equipo y Maquinar"}
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async () => {
        setIsSubmitting(true);

        const result = categorySchema.safeParse(formData);
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
            const response = await createCategory(payload);
            console.log("Categoría creada:", response);
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
        label = "Crear categoría";
    }


    return (
        <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}>
            <Navbar />
            <div className="flex flex-col flex-1 px-4 sm:px-6 lg:px-10 py-8 gap-4 justify-center">
                {/* Título y tarjeta comparten el mismo ancho máximo y quedan
            centrados juntos, así el título siempre queda a la par del
            borde izquierdo de la tarjeta sin importar el tamaño de
            pantalla (antes se usaba un marginLeft fijo en px que solo
            calzaba en una resolución específica). */}
                <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
                    <h1 style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0 }}>
                        Crear Categoría
                    </h1>
                    <div className="bg-white rounded-2xl flex flex-col gap-6 w-full shadow justify-center items-center p-6 sm:p-8">
                        <p className="self-start" style={{ fontSize: "var(--fs-xxs)", color: "var(--color-gray-500)" }}>
                            Completa el campo para registrar una nueva categoría
                        </p>
                        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="flex flex-col gap-6 w-full">
                            <div className="flex flex-col gap-2">
                                <Select
                                    label={<span>Tipo de elemento <span style={{ color: "red" }}>*</span></span>}
                                    name="categoryElementType"
                                    options={tipoElemento}
                                    value={formData.categoryElementType}
                                    onChange={handleChange}
                                    error={errors.categoryElementType}
                                />

                                {/* Fila 5 — Detalles */}
                                <Input
                                    label={<span>Nombre de la categoría <span style={{ color: "red" }}>*</span></span>}
                                    name="categoryName"
                                    value={formData.categoryName}
                                    onChange={handleChange}
                                    error={errors.categoryName}
                                />
                            </div>
                            {/* Acciones */}
                            <div className="flex flex-wrap justify-center gap-3 pt-2 w-full">
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
                            title="Confirmar creación de categoría"
                            onClose={() => setIsModalOpen(false)}
                            onConfirm={handleSubmit}
                            confirmText="Crear"
                            cancelText="Cancelar"
                        >
                            <p>¿Seguro que deseas crear esta categoría?</p>
                        </Modal>

                    </div>
                </div>
            </div>
        </div>
    );
}
