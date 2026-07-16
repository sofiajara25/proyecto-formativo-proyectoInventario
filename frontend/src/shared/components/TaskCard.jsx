import { useState } from "react";
import { Modal, Button } from "@/shared";
import { TasksUpdateForm } from "@/features/tasks"

export default function TaskCard({ task, onTaskUpdated }) {
    const { name, description, dueDate, createdAt, userName } = task;
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false); // 👈 nuevo estado

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
                    <h3
                        className="font-heading text-sm font-semibold truncate"
                        style={{ color: "var(--color-primary-950)" }}
                    >
                        {name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {description}
                    </p>
                    {userName && (
                        <p className="text-xs text-gray-700 mt-1">👤 Usuario: {userName}</p>
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
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Descripción</p>
                        <p className="text-sm text-gray-700">{description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Fecha de creación</p>
                            <p className="text-sm text-gray-700">{formatDate(createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Fecha de entrega</p>
                            <p
                                className="text-sm font-semibold"
                                style={{ color: "var(--color-tertiary-950)" }}
                            >
                                {formatDate(dueDate)}
                            </p>
                        </div>
                    </div>

                    {userName && (
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Usuario asignado</p>
                            <p className="text-sm text-gray-700">{userName}</p>
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
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
