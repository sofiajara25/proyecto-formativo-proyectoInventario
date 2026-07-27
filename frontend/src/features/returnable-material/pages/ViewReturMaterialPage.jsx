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
    const [retornable, setmaterialReturnable] = useState(null);

    useEffect(() => {
        getReturnableById(id)
            .then(setmaterialReturnable)
            .catch((err) => console.error("Error cargando material devolutivo:", err));
    }, [id]);

    if (!retornable) {
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
                            {retornable.photo_url ? (
                                <img
                                    src={`http://localhost:5000/${retornable.photo_url}`}
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
                                {retornable.material_name}
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--fs-xxs)",
                                    color: "var(--color-gray-500)",
                                    margin: 0,
                                }}
                            >
                                Custodio: {retornable.custodian}
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--fs-xxs)",
                                    fontWeight: "var(--font-weight-bold)",
                                    color: "var(--color-primary-950)",
                                    margin: 0,
                                }}
                            >
                                Estado: {retornable.status ? "Activo" : "Inactivo"}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Detalles en vertical */}
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Código herramienta:</strong> {retornable.tool_id}</p>
                        <p><strong>Placa SENA:</strong> {retornable.sena_plate}</p>
                        <p><strong>Serial:</strong> {retornable.serial}</p>
                        <p><strong>Modelo:</strong> {retornable.model}</p>
                        <p><strong>Valor unitario:</strong> ${retornable.unit_value}</p>
                        <p><strong>Cantidad:</strong> {retornable.quantity}</p>
                        <p><strong>Valor total:</strong> ${retornable.total_value}</p>
                        <p><strong>Dimenciones:</strong> {retornable.dimensions}</p>
                        <p><strong>Descripción:</strong> {retornable.description}</p>
                        <p>
                            <strong>Ficha Tecnica:</strong>{" "}
                            {retornable.technical_sheet ? (
                                <a
                                    href={`http://localhost:5000/${retornable.technical_sheet}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    Ver archivo
                                </a>
                            ) : (
                                "Sin archivo"
                            )}
                        </p>
                        <p><strong>Ubicación:</strong> {retornable.location}</p>
                    </div>


                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Acciones */}
                    <div className="flex justify-end">
                        <Button
                            onClick={() =>
                                navigate(`/dashboard/retornables/${retornable.id}/edit`)}
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
