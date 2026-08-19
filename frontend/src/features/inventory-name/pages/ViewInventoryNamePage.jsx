import { useNavigate, useParams } from "react-router-dom";
import { Navbar, Button } from "@/shared";
import { Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { getInventoryNameById } from "../services/inventoryNameService";

export default function ViewBrandPage() {
    const navigate = useNavigate();
    const { inventoryName_id } = useParams();
    const [inventoryName, setInventoryName] = useState(null);

    useEffect(() => {
        getInventoryNameById(inventoryName_id)
            .then(setInventoryName)
            .catch((err) => console.error("Error cargando nombre de inventario:", err));
    }, [inventoryName_id]);

    if (!inventoryName) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    background:
                        "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                }}
            >
                <p style={{ color: "var(--color-white)", fontSize: "var(--fs-sm)" }}>
                    Nombre de Inventario no encontrada.
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
                                {inventoryName.inventory_name}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Detalles */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-1">
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
                                Nombre del Inventario
                            </p>
                            <p
                                style={{
                                    fontSize: "var(--fs-xxs)",
                                    color: "var(--color-gray-900)",
                                    margin: 0,
                                }}
                            >
                                {inventoryName.inventory_name}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Acciones */}
                    <div className="flex justify-end">
                        <Button
                            onClick={() => navigate(`/dashboard/inventory-names/${inventoryName.id}/edit`)}
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
