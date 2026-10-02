import { useState, useCallback } from "react";
import { Input, Button, Navbar, Modal } from "@/shared";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getCategoryById, updateCategory } from "../service/categoryService";
import { categorySchema } from "../schemas/categorysSchema";
import { showAlert, showSuccessAndThen } from "@/shared/utils/alertBus";
import { useFormExitGuard } from "@/shared/hooks/useFormExitGuard";

export default function CategoryUpdateForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        categoryName: ""
    });

    // Pregunta antes de salir si ya hay datos ingresados (botón Cancelar
    // del formulario y Cancelar de la ventana de confirmación).
    const { markClean, requestExit, exitModal } = useFormExitGuard(formData, () => navigate(-1));

    // Lo que se carga de la base de datos no cuenta como "datos ingresados".
    const setLoadedData = useCallback((data) => {
        setFormData(data);
        markClean(data);
    }, [markClean]);

    // Las 3 categorías por defecto (Herramientas, Equipo y Maquinaria,
    // Muebles y Enseres) no se pueden renombrar: el backend lo rechaza.
    const [isDefault, setIsDefault] = useState(false);

    const [errors, setErrors] = useState({});

    const { id } = useParams();

    useEffect(() => {
        getCategoryById(id)
            .then((data) => {
                setLoadedData({ categoryName: data.category_name });
                setIsDefault(Boolean(data.is_default));
            })
            .catch((err) => console.error("Error cargando categoría:", err));
    }, [id, setLoadedData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const result = categorySchema.safeParse(formData);
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
            await updateCategory(id, result.data);
            showSuccessAndThen("Categoría actualizada con éxito", () => navigate(-1));
        } catch (error) {
            console.error("Error:", error.message);
            showAlert(error.message, { type: "error" });
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    };
    // =======================================================

    let label;
    // 😂 lógica fuera del JSX
    if (isSubmitting) {
        label = "Actualizando...";
    } else {
        label = "Actualizar Categoría";
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

            <div className="flex flex-col flex-1 px-4 sm:px-6 lg:px-10 py-8 gap-4 justify-center">
                {/* Título y tarjeta comparten el mismo ancho máximo y quedan
                    centrados juntos, así el título siempre queda a la par
                    del borde izquierdo de la tarjeta sin importar el
                    tamaño de pantalla. */}
                <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
                    <h1
                        style={{
                            color: "var(--color-white)",
                            fontSize: "var(--fs-md)",
                            fontWeight: "var(--font-weight-bold)",
                            margin: 0,
                        }}
                    >
                        Actualizar Categoría
                    </h1>

                    {/* Card */}
                    <div className="bg-white rounded-2xl flex flex-col gap-6 w-full shadow justify-center items-center p-6 sm:p-8">

                        <form
                            onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                            className="flex flex-col gap-6 w-full"
                        >
                            <div className="flex flex-col gap-2">
                                <Input
                                    label="Nombre de la categoría"
                                    name="categoryName"
                                    value={formData.categoryName}
                                    onChange={handleChange}
                                    disabled={isDefault}
                                    error={errors.categoryName}
                                />
                                {isDefault && (
                                    <p className="text-caption text-gray-500">
                                        Esta es una categoría por defecto del sistema: no se puede renombrar ni desactivar.
                                    </p>
                                )}
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-wrap justify-center gap-3 pt-2 w-full">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="md"
                                    onClick={() => requestExit()}
                                >
                                    Cancelar
                                </Button>
                                <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                                    {label}
                                    {/* {isSubmitting ? "Guardando..." : "Guardar"} */}
                                </Button>
                            </div>
                        </form>
                        {exitModal}
                        <Modal
                            isOpen={isModalOpen}
                            title="Confirmar actualización de categoría"
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
                            <p>¿Seguro que deseas actualizar esta categoría?</p>
                        </Modal>

                    </div>
                </div>
            </div>
        </div>
    );
}