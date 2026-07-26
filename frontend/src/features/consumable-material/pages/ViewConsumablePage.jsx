import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar, Button, formatDate } from "@/shared";
import { FileText } from "lucide-react";
import { getConsumableById } from "../services/consumableMaterialService";

export default function ViewConsumablePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [consumable, setConsumable] = useState(null);

    useEffect(() => {
        getConsumableById(id)
            .then(setConsumable)
            .catch((err) => console.error("Error cargando material:", err));
    }, [id]);

    if (!consumable) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))" }}>
                <p style={{ color: "var(--color-white)", fontSize: "var(--fs-sm)" }}>
                    Material de consumo no encontrado.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}>
            <Navbar />
            <div className="flex flex-1 items-center justify-center px-10 py-8">
                <div className="bg-white rounded-2xl flex flex-col gap-6"
                    style={{ padding: "36px 40px", width: "100%", maxWidth: "680px" }}>
                    {/* Header */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center justify-center rounded-full"
                            style={{ width: "80px", height: "80px", background: "var(--color-primary-950)", flexShrink: 0 }}>
                                {consumable.photo_url ? (
                                <img
                                    src={`http://localhost:5000/${consumable.photo_url}`}
                                    alt="Foto del material de consumo"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <FileText size={40} color="white" />
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-lg font-bold text-gray-900">{consumable.material_name}</p>
                            <p className="text-sm text-gray-500">Custodio: {consumable.accountant}</p>
                            <p className="text-sm font-bold text-primary-950">
                                Estado: {consumable.status ? "Activo" : "Inactivo"}
                            </p>
                        </div>
                    </div>

                    {/* Detalles */}
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Código herramienta:</strong> {consumable.tool_id}</p>
                        <p><strong>Placa SENA:</strong> {consumable.sena_plate}</p>
                        <p><strong>Fecha de ingreso:</strong> {formatDate(consumable.entry_date)}</p>
                        <p><strong>Cantidad:</strong> {consumable.quantity}</p>
                        <p><strong>Ubicación:</strong> {consumable.location}</p>
                        <p><strong>Valor unitario:</strong> ${consumable.unit_value}</p>
                        <p><strong>Valor total:</strong> ${consumable.total_value}</p>
                        <p><strong>Descripción:</strong> {consumable.description}</p>
                    </div>

                    {/* Acciones */}
                    <div className="flex justify-end mt-4 gap-4">
                        <Button variant="secondary" onClick={() => navigate(-1)}>Volver</Button>
                        <Button variant="primary" onClick={() => navigate(`/dashboard/consumibles/${id}/edit`)}>Editar</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
