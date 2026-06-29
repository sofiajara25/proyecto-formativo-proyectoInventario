import { useState } from "react";
import DataTable from "@/shared/components/DataTable";
import { returnsColumns } from "../table/returnsColumns";
// import { returns } from "../data/returns";
import { Button, Navbar } from "@/shared";
import { useNavigate } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";
import { getReturns } from "../services/returnService";
import { useEffect } from "react";

export default function ListReturnPage() {
    const navigate = useNavigate();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [returns, setReturns] = useState([]);

    useEffect(() => {
        getReturns()
            .then((data) => {
                console.log("Retorno desde backend:", data);
                setReturns(data);
            })
            .catch((err) => console.error("Error cargando retorno:", err));
    }, []);

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
                    Retorno del material
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
                            Listado de retorno de material registrados
                        </p>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="primary"
                                size="md"
                                onClick={() => setIsReportModalOpen(true)}
                            >
                                Reportar retorno
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                size="md"
                                onClick={() => navigate("/dashboard/retorno")}
                            >
                                Crear retorno
                            </Button>
                        </div>
                    </div>

                    {/* Tabla */}
                    <DataTable data={returns} columns={returnsColumns} />
                </div>
            </div>

            <ReportConfigModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />
        </div>
    );
}
