import { useNavigate, useParams } from "react-router-dom";
import { Navbar, Button, PhotoViewer, FileViewer } from "@/shared";
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
                        <PhotoViewer
                            photos={Array.isArray(retornable.photos) ? retornable.photos : (retornable.photo_url ? [retornable.photo_url] : [])}
                            fallbackIcon={<Package size={40} color="white" />}
                            size={80}
                            alt="Foto del material devolutivo"
                        />

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
                        <p><strong>Categoria:</strong> {retornable.category_name ? `${retornable.category_name} (${retornable.category_element_type})` : "—"}</p>

                        <p><strong>Serial:</strong> {retornable.serial || "—"}</p>
                        <p><strong>Modelo:</strong> {retornable.model || "—"}</p>
                        <p><strong>Valor unitario:</strong> ${retornable.unit_value}</p>
                        <p><strong>Cantidad:</strong> {retornable.quantity}</p>
                        <p><strong>Valor total:</strong> ${retornable.total_value}</p>
                        <p><strong>Dimenciones:</strong> {retornable.dimensions || "—"}</p>
                        <p><strong>Marca:</strong> {retornable.brand_name || "—"}</p>
                        <p><strong>Descripción:</strong> {retornable.description}</p>
                        <p><strong>Nombre del inventario:</strong> {retornable.inventory_name || "—"}</p>
                        <p><strong>Ubicación:</strong> {retornable.location || "—"}</p>
                    </div>

                    {/* Ficha técnica: miniatura clicable que abre el archivo en grande */}
                    <div>
                        <p className="mb-2"><strong>Ficha Tecnica:</strong></p>
                        {retornable.technical_sheet ? (
                            <FileViewer file={retornable.technical_sheet} label="Ficha técnica" />
                        ) : (
                            <p className="text-sm text-gray-500">Sin archivo</p>
                        )}
                    </div>

                    {/* Cotizaciones enlazadas (elegidas del catálogo de Cotizaciones) */}
                    <div>
                        <p className="mb-2"><strong>Cotizaciones:</strong></p>
                        {Array.isArray(retornable.quotations) && retornable.quotations.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {retornable.quotations.map((q) => (
                                    <FileViewer key={q.quotation_id} file={q.pdf_url} label={q.quotation_name} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Sin cotizaciones</p>
                        )}
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
