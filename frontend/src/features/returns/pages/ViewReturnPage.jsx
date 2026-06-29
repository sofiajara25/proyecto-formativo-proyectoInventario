import { useNavigate, useParams } from "react-router-dom";
import { Navbar, Button } from "@/shared";
import { Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { getReturnById } from "../services/returnService";

export default function ViewReturnPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [returns, setReturn] = useState(null);

    useEffect(() => {
        getReturnById(id)
            .then(setReturn)
            .catch((err) => console.error("Error cargando retorno:", err));
    }, [id]);

    if (!returns) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    background:
                        "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                }}
            >
                <p style={{ color: "var(--color-white)", fontSize: "var(--fs-sm)" }}>
                    Retorno no encontrada.
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
                    style={{ padding: "36px 40px", width: "100%", maxWidth: "680px" }}
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
                                {returns.material_type}
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--fs-xxs)",
                                    color: "var(--color-gray-500)",
                                    margin: 0,
                                }}
                            >
                                Id prestamo: {returns.loan_id}
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--fs-xxs)",
                                    fontWeight: "var(--font-weight-bold)",
                                    color: "var(--color-primary-950)",
                                    margin: 0,
                                }}
                            >
                                Estado: {
                                    returns.is_available
                                        ? "Disponible"
                                        : returns.is_maintenance
                                            ? "En mantenimiento"
                                            : returns.is_low
                                                ? "Baja"
                                                : "Sin estado"
                                }
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Detalles */}
                    <div className="grid grid-cols-1 gap-4">
                        <p><strong>Tipo de Material:</strong> {returns.material_type}</p>
                        <p><strong>ID del Préstamo:</strong> {returns.loan_id}</p>
                        <p><strong>Fecha de Devolución:</strong> {returns.return_date}</p>
                        <p><strong>Cantidad Devuelta:</strong> {returns.description}</p>
                        <p><strong>Descripción / Observaciones:</strong> ${returns.quantity}</p>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Acciones */}
                    <div className="flex justify-end">
                        <Button
                            onClick={() => navigate(`/dashboard/retorno/${returns.id}/edit`)}
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
