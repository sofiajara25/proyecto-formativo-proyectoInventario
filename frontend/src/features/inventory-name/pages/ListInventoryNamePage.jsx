import DataTable from "@/shared/components/DataTable"

import { Button, Navbar } from "@/shared"
import { useNavigate } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";
import { useEffect, useState } from "react";
import { getInventoryName } from "../services/inventoryNameService";
import { inventoryNamesColumns } from "../table/inventoryNameColumns";
import { hasPermission } from "@/shared/utils/permissions";

export default function ListInventoryNamePage() {
    const navigate = useNavigate();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const canCreate = hasPermission("create_inventory_name");
    const canReport = hasPermission("report_inventory_name");

    const [inventoryNames, setinventoryNames] = useState([]);

    useEffect(() => {
        getInventoryName()
            .then(setinventoryNames)
            .catch((err) => console.error("Error cargando nombre de inventario:", err));
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
                    Nombre de Inventario
                </h1>

                {/* Card */}
                <div
                    className="bg-white rounded-2xl flex flex-col gap-4"
                    style={{ padding: "28px 32px" }}
                >
                    {/* Acciones */}
                    <div className="flex items-center justify-between">
                        <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-gray-500)", margin: 0 }}>
                            Listado de nombres de inventarios registradas
                        </p>
                        <div className="flex gap-3">
                            {canReport && (
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="md"
                                    onClick={() => setIsReportModalOpen(true)}
                                >
                                    Reportar inventario
                                </Button>
                            )}
                            {canCreate && (
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="md"
                                    onClick={() => navigate("/dashboard/nombreInventario")}
                                >
                                    Crear nombre inventario
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Tabla */}
                    <DataTable
                        data={inventoryNames}
                        columns={inventoryNamesColumns}
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
