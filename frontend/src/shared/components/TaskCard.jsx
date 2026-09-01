import { useState } from "react";
import { Calendar, User as UserIcon } from "lucide-react";
import { Modal, Button } from "@/shared";
import { TasksUpdateForm } from "@/features/tasks"

// Estado "visible" de la tarea: si la rechazaron, el status vuelve a
// "Pendiente" en la base de datos (para que la puedan volver a hacer),
// pero acá se quiere mostrar como "Rechazada" y no como una pendiente
// normal. Se usa tanto en la tarjeta como en el filtro de TasksPage.
export function getTaskDisplayStatus(task) {
    if (task.status === "Completada") return "Completada";
    if (task.status === "En revisión") return "En revisión";
    if (task.rejectedAt) return "Rechazada";
    return "Pendiente";
}

const STATUS_STYLES = {
    "Pendiente": { bg: "#f3f4f6", color: "#4b5563" },
    "En revisión": { bg: "#dbeafe", color: "#1d4ed8" },
    "Completada": { bg: "#dcfce7", color: "#15803d" },
    "Rechazada": { bg: "#fee2e2", color: "#b91c1c" },
};

function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] ?? STATUS_STYLES["Pendiente"];
    return (
        <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{ backgroundColor: style.bg, color: style.color }}
        >
            {status}
        </span>
    );
}

export default function TaskCard({ task, onTaskUpdated }) {
    const { name, description, dueDate, createdAt, userName, userLastname } = task;
    const fullUserName = [userName, userLastname].filter(Boolean).join(" ");
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false); // 👈 nuevo estado
    const displayStatus = getTaskDisplayStatus(task);

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <>
            {/* Card clickeable */}
            <div
                onClick={() => setIsOpen(true)}
                className="bg-white rounded-2xl flex flex-col justify-between transition-transform hover:scale-[1.02] cursor-pointer"
                style={{
                    border: "2.5px solid transparent",
                    padding: "16px 20px",
                    minHeight: "110px",
                    fontFamily: "var(--main-font)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
            >
                <div>
                    <div className="flex items-start justify-between gap-2">
                        <h3
                            className="font-heading text-sm font-semibold truncate"
                            style={{ color: "var(--color-primary-950)" }}
                        >
                            {name}
                        </h3>
                        <StatusBadge status={displayStatus} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {description}
                    </p>
                    {fullUserName && (
                        <p className="text-xs text-gray-700 mt-1">👤 Usuario: {fullUserName}</p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400">
                    <span>Creada: {formatDate(createdAt)}</span>
                    <span style={{ color: "var(--color-tertiary-950)", fontWeight: 600 }}>
                        Entrega: {formatDate(dueDate)}
                    </span>
                </div>
            </div>

            {/* Modal de detalle */}
            <Modal
                isOpen={isOpen}
                title={name}
                onClose={() => setIsOpen(false)}
                showFooter={false}
            >
                <div className="flex flex-col gap-4" style={{ fontFamily: "var(--main-font)" }}>
                    {/* Estado + usuario asignado, arriba y bien visibles */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <StatusBadge status={displayStatus} />
                        {fullUserName && (
                            <span className="flex items-center gap-1.5 text-xs text-gray-600">
                                <UserIcon size={14} className="text-gray-400" />
                                {fullUserName}
                            </span>
                        )}
                    </div>

                    {/* Descripción en su propia caja, para separarla de los datos */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Descripción</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{description || "—"}</p>
                    </div>

                    {/* Fechas agrupadas en una sola caja, lado a lado */}
                    <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                <Calendar size={12} /> Creación
                            </p>
                            <p className="text-sm text-gray-700">{formatDate(createdAt)}</p>
                        </div>
                        <div className="border-l border-gray-200 pl-3">
                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                <Calendar size={12} /> Entrega
                            </p>
                            <p
                                className="text-sm font-semibold"
                                style={{ color: "var(--color-tertiary-950)" }}
                            >
                                {formatDate(dueDate)}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-3 border-t border-gray-100">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                                setIsOpen(false);
                                setIsEditOpen(true); // 👈 abrir modal de edición encima
                            }}
                        >
                            Editar
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Modal de edición */}
            {isEditOpen && (
                <TasksUpdateForm
                    task={task}
                    onClose={() => setIsEditOpen(false)}
                    onTaskUpdated={onTaskUpdated}
                />
            )}
        </>
    );
}
