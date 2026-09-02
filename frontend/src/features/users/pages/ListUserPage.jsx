import { useState } from "react";
import DataTable from "@/shared/components/DataTable"
import { usersColumns } from "../table/usersColumns"
// import { users } from "../data/users"
import { Button, Navbar } from "@/shared"
import { useNavigate } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";
import { getUsers } from "../services/userService";
import { useEffect } from "react";
import { hasPermission } from "@/shared/utils/permissions";

export default function ListUserPage() {
    const navigate = useNavigate();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const canCreate = hasPermission("create_user");
    const canReport = hasPermission("report_user");

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers()
            .then((data) => {
                console.log("Usuarios desde backend:", data);
                setUsers(data);
            })
            .catch((err) => console.error("Error cargando usuarios:", err));
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

            <div className="flex flex-col flex-1 px-10 py-1 gap-1">

                {/* Título */}
                <h1
                    style={{
                        color: "var(--color-white)",
                        fontSize: "var(--fs-md)",
                        fontWeight: "var(--font-weight-bold)",
                        margin: 0,
                    }}
                >
                    Usuarios
                </h1>

                {/* Card */}
                <div
                    className="bg-white rounded-2xl flex flex-col gap-4"
                    style={{ padding: "14px 32px" }}
                >
                    {/* Acciones */}
                    <div className="flex items-center justify-between">
                        <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-gray-500)", margin: 0 }}>
                            Listado de usuarios registrados
                        </p>
                        <div className="flex gap-3">
                            {canReport && (
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="md"
                                    onClick={() => setIsReportModalOpen(true)}
                                >
                                    Reportar usuario
                                </Button>
                            )}
                            {canCreate && (
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="md"
                                    onClick={() => navigate("/dashboard/usuarios")}
                                >
                                    Crear usuario
                                </Button>
                            )}
                        </div>
                    </div>

                    <DataTable
                        data={users}
                        columns={usersColumns}
                        onRowClick={(row) => navigate(`/dashboard/users/${row.original.id}`)}
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