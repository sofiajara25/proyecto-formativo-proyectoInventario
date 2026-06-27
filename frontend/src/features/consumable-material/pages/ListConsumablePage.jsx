import { useEffect, useState } from "react";
import DataTable from "@/shared/components/DataTable"
import { consumablesColumns } from "../table/consumablesColumns"
// import { consumables } from "../data/consumables";
import { Button, Navbar } from "@/shared"
import { useNavigate } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";
import { getConsumables } from "../services/consumableMaterialService";

export default function ListConsumablePage() {
    const navigate = useNavigate();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [consumables, setConsumables] = useState([]);

    useEffect(() => {
        getConsumables()
            .then(setConsumables)
            .catch((err) => console.error("Error cargando consumibles:", err));
    }, []);

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                fontFamily: "var(--main-font)"
            }}
        >
            <Navbar />

            <div className="flex flex-col flex-1 px-10 py-8 gap-4">
                {/* Título */}
                <h1
                    style={{
                        color: "var(--color-white)",
                        fontSize: "var(--fs-md)",
                        fontWeight: "var(--font-weight-bold)",
                        margin: 0,
                    }}
                >
                    Materiales de Consumo
                </h1>

                {/* Card */}
                <div
                    className="bg-white rounded-2xl flex flex-col gap-4"
                    style={{ padding: "28px 32px" }}
                >
                    {/* Acciones */}
                    <div className="flex items-center justify-between">
                        <p
                            style={{
                                fontSize: "var(--fs-xxs)",
                                color: "var(--color-gray-500)",
                                margin: 0,
                            }}
                        >
                            Listado de materiales de consumo registrados
                        </p>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="primary"
                                size="md"
                                onClick={() => setIsReportModalOpen(true)}
                            >
                                Reportar material de consumo
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                size="md"
                                onClick={() => navigate("/dashboard/consumo")}
                            >
                                Crear material de consumo
                            </Button>
                        </div>
                    </div>

                    {/* Tabla */}
                    <DataTable
                        data={consumables}
                        columns={consumablesColumns}
                    />
                </div>
            </div>

            <ReportConfigModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />
        </div>
    );
}
