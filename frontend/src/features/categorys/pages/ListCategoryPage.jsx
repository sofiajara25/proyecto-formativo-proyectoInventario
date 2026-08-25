import DataTable from "@/shared/components/DataTable"

import { Button, Navbar } from "@/shared"
import { useNavigate } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";
import { useEffect, useState } from "react";
import { getCategorys } from "../service/categoryService";
import { categorysColumns } from "../table/categorysColumns";

export default function ListBrandPage() {
    const navigate = useNavigate();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const [categorys, setCategorys] = useState([]);

    useEffect(() => {
        getCategorys()
            .then(setCategorys)
            .catch((err) => console.error("Error cargando categoría:", err));
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
                    Categoría
                </h1>

                {/* Card */}
                <div
                    className="bg-white rounded-2xl flex flex-col gap-4"
                    style={{ padding: "28px 32px" }}
                >
                    {/* Acciones */}
                    <div className="flex items-center justify-between">
                        <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-gray-500)", margin: 0 }}>
                            Listado de categorías registradas
                        </p>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="primary"
                                size="md"
                                onClick={() => setIsReportModalOpen(true)}
                            >
                                Reportar categoría
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                size="md"
                                onClick={() => navigate("/dashboard/categoria")}
                            >
                                Crear categoría
                            </Button>
                        </div>
                    </div>

                    {/* Tabla */}
                    <DataTable
                        data={categorys}
                        columns={categorysColumns}
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
