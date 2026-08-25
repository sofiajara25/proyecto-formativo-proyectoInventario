import { useNavigate, useParams } from "react-router-dom";
import { Navbar, Button } from "@/shared";
import { Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategoryById } from "../service/categoryService";


export default function ViewCategoryPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [category, setCategory] = useState(null);

    useEffect(() => {
        getCategoryById(id)
            .then(setCategory)
            .catch((err) => console.error("Error cargando categoría:", err));
    }, [id]);

    if (!category) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    background:
                        "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                }}
            >
                <p style={{ color: "var(--color-white)", fontSize: "var(--fs-sm)" }}>
                    Categoría no encontrada.
                </p>
            </div>
        );
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

            <div className="flex flex-1 items-center justify-center px-10 py-8">
                <div
                    className="bg-white rounded-2xl flex flex-col gap-6"
                    style={{ padding: "36px 40px", width: "100%", maxWidth: "350px" }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-6">
                        <div
                            className="flex items-center justify-center rounded-full"
                            style={{
                                width: "80px",
                                height: "80px",
                                background: "var(--color-primary-950)",
                                flexShrink: 0,
                            }}
                        >
                            <Tag size={40} color="white" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <p
                                style={{
                                    fontSize: "var(--fs-sm)",
                                    fontWeight: "var(--font-weight-bold)",
                                    color: "var(--color-gray-900)",
                                    margin: 0,
                                }}
                            >
                                {category.category_name}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Detalles en vertical */}
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Nombre de la categoría:</strong> {category.category_name}</p>
                        <p><strong>Tipo de elemento:</strong> {category.element_type}</p>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Acciones */}
                    <div className="flex justify-end">
                        <Button
                            onClick={() => navigate(`/dashboard/categorys/${category.category_id}/edit`)}
                            type="button"
                            variant="primary"
                            size="md"
                        >
                            Editar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
