import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/shared";
import { FileText } from "lucide-react"; // ícono para materiales
import { consumables } from "../data/consumables";

export default function ViewConsumablePage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const consumable = consumables.find((c) => c.id === Number(id));

    if (!consumable)
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    background:
                        "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                }}
            >
                <p
                    style={{
                        color: "var(--color-white)",
                        fontSize: "var(--fs-sm)",
                    }}
                >
                    Material de consumo no encontrado.
                </p>
            </div>
        );

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background:
                    "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                fontFamily: "var(--main-font)",
            }}
            onClick={() => navigate("/dashboard/list-consumibles")}
        >
            <Navbar />

            <div
                className="flex flex-1 items-center justify-center px-10 py-8"
                onClick={() => navigate("/dashboard/list-consumibles")}
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
                            <FileText size={40} color="white" />
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
                                {consumable.materialName}
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--fs-xxs)",
                                    color: "var(--color-gray-500)",
                                    margin: 0,
                                }}
                            >
                                Custodio: {consumable.custodian}
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--fs-xxs)",
                                    fontWeight: "var(--font-weight-bold)",
                                    color: "var(--color-primary-950)",
                                    margin: 0,
                                }}
                            >
                                Estado: {consumable.status ? "Activo" : "Inactivo"}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Detalles */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Código herramienta", value: consumable.toolId },
                            { label: "Placa SENA", value: consumable.senaPlate },
                            { label: "Serial", value: consumable.serial },
                            { label: "Modelo", value: consumable.modelo },
                            { label: "Cantidad", value: consumable.quantity },
                            { label: "Valor unitario", value: `$${consumable.unitValue}` },
                            { label: "Valor total", value: `$${consumable.totalValue}` },
                            { label: "Dimensiones", value: consumable.dimensions },
                            { label: "Ubicación", value: consumable.location },
                            { label: "Ficha técnica", value: consumable.techSheet },
                            { label: "Descripción", value: consumable.description },
                        ].map((item) => (
                            <div key={item.label} className="flex flex-col gap-1">
                                <p
                                    style={{
                                        fontSize: "var(--fs-xxxs)",
                                        fontWeight: "var(--font-weight-bold)",
                                        color: "var(--color-gray-500)",
                                        margin: 0,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    {item.label}
                                </p>
                                <p
                                    style={{
                                        fontSize: "var(--fs-xxs)",
                                        color: "var(--color-gray-900)",
                                        margin: 0,
                                    }}
                                >
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Acciones */}
                    <div className="flex justify-end">
                        <button
                            onClick={() =>
                                navigate(`/dashboard/consumibles/${consumable.id}/edit`)
                            }
                            className="rounded-full px-6 py-2 cursor-pointer transition-all"
                            style={{
                                background: "var(--color-primary-950)",
                                color: "var(--color-white)",
                                fontSize: "var(--fs-xxs)",
                                fontWeight: "var(--font-weight-bold)",
                                border: "none",
                                fontFamily: "var(--main-font)",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-primary-700)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "var(--color-primary-950)")
                            }
                        >
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
