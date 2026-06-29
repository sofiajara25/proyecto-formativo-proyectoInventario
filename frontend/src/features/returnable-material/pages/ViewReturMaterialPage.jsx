import { useNavigate, useParams } from "react-router-dom";
import { Navbar, Button } from "@/shared";
import { Package } from "lucide-react"; // ícono para materiales devolutivos
// import { returnables } from "../data/returnables";
import { getReturnableById } from "../services/returnableMaterialService"
import { useEffect } from "react";
import { useState } from "react";


export default function ViewReturMaterialPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [materialReturnable, setmaterialReturnable] = useState(null);

    useEffect(() => {
        getReturnableById(id)
            .then(setmaterialReturnable)
            .catch((err) => console.error("Error cargando material devolutivo:", err));
    }, [id]);

    if (!materialReturnable) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))" }}>
                <p style={{ color: "var(--color-white)", fontSize: "var(--fs-sm)" }}>
                    Material devolutivo no encontrado.
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
            onClick={() => navigate("/dashboard/list-devolutivos")}
        >
            <Navbar />

            <div
                className="flex flex-1 items-center justify-center px-10 py-8"
                onClick={() => navigate("/dashboard/list-devolutivos")}
            >
                <div
                    className="bg-white rounded-2xl flex flex-col gap-6"
                    style={{
                        padding: "36px 40px",
                        width: "100%",
                        maxWidth: "680px",
                    }}
                    onClick={(e) => e.stopPropagation()}
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
                            {materialReturnable.photo_url ? (
                                <img
                                    src={`http://localhost:5000/${materialReturnable.photo_url}`}
                                    alt="Foto del material de consumo"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <Package size={40} color="white" />
                            )}
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
                                {materialReturnable.material_name}
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--fs-xxs)",
                                    color: "var(--color-gray-500)",
                                    margin: 0,
                                }}
                            >
                                Custodio: {materialReturnable.custodian}
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--fs-xxs)",
                                    fontWeight: "var(--font-weight-bold)",
                                    color: "var(--color-primary-950)",
                                    margin: 0,
                                }}
                            >
                                Estado: {materialReturnable.status ? "Activo" : "Inactivo"}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Detalles en vertical */}
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Código herramienta:</strong> {materialReturnable.tool_id}</p>
                        <p><strong>Placa SENA:</strong> {materialReturnable.sena_plate}</p>
                        <p><strong>Serial:</strong> {materialReturnable.serial}</p>
                        <p><strong>Modelo:</strong> {materialReturnable.model}</p>
                        <p><strong>Valor unitario:</strong> ${materialReturnable.unit_value}</p>
                        <p><strong>Cantidad:</strong> {materialReturnable.quantity}</p>
                        <p><strong>Valor total:</strong> ${materialReturnable.total_value}</p>
                        <p><strong>Dimenciones:</strong> {materialReturnable.dimensions}</p>
                        <p><strong>Descripción:</strong> {materialReturnable.description}</p>
                        <p><strong>Ficha Tecnica:</strong> {materialReturnable.technical_sheet}</p>
                        <p><strong>Ubicación:</strong> {materialReturnable.location}</p>
                    </div>


                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Acciones */}
                    <div className="flex justify-end">
                        <Button
                            onClick={() =>
                                navigate(`/dashboard/devolutivos/${materialReturnable.id}/edit`)}
                            type="button" variant="primary" size="md"
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-primary-700)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "var(--color-primary-950)")
                            }
                        >
                            Editar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
