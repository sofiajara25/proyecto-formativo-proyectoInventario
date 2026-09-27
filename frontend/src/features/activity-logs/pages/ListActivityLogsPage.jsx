import DataTable from "@/shared/components/DataTable";
import { activityLogsColumns } from "../table/activityLogsColumns";
import { getActivityLogs } from "../service/activityLogService";
import { Navbar } from "@/shared";
import { useEffect, useState } from "react";
import { showAlert } from "@/shared/utils/alertBus";

export default function ListActivityLogsPage() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        getActivityLogs()
            .then((data) => setLogs(data.logs))
            .catch((err) => {
                console.error("Error cargando la bitácora de actividad:", err);
                showAlert(err.message, { type: "error" });
            });
    }, []);

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                fontFamily: "var(--main-font)",
            }}
        >
            <Navbar />

            <div className="flex flex-col flex-1 px-10 py-8 gap-4">
                <h1
                    style={{
                        color: "var(--color-white)",
                        fontSize: "var(--fs-md)",
                        fontWeight: "var(--font-weight-bold)",
                        margin: 0,
                    }}
                >
                    Logs de actividad
                </h1>

                <div className="bg-white rounded-2xl flex flex-col gap-4" style={{ padding: "28px 32px" }}>
                    <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-gray-500)", margin: 0 }}>
                        Registro de quién creó, actualizó o cambió el estado de algo en el sistema, y cuándo.
                        Solo visible para el Super Administrador.
                    </p>

                    <DataTable data={logs} columns={activityLogsColumns} />
                </div>
            </div>
        </div>
    );
}
