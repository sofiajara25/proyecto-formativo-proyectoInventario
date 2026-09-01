import { useState } from "react";
import { Modal, Button, FileInput } from "@/shared";
import { submitTaskEvidence } from "../services/taskService";

// Tarjeta de "Mis tareas" en el perfil: a diferencia de TaskCard (que solo
// muestra/edita la tarea), esta deja marcarla como hecha adjuntando una
// foto obligatoria de evidencia, y muestra en qué estado va: Pendiente,
// En revisión (esperando que quien la asignó la confirme) o Completada.
export default function TaskEvidenceCard({ task, onUpdated }) {
    const { id, name, description, dueDate, status, evidencePhoto } = task;
    const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
    const [photo, setPhoto] = useState([]);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const statusBadge = {
        Pendiente: { label: "Pendiente", className: "bg-gray-100 text-gray-700" },
        "En revisión": { label: "Esperando confirmación", className: "bg-amber-100 text-amber-800" },
        Completada: { label: "Completada", className: "bg-green-100 text-green-800" },
    }[status] ?? { label: status, className: "bg-gray-100 text-gray-700" };

    const handleSubmitEvidence = async () => {
        if (!photo.length) {
            setError("Debes adjuntar una foto como evidencia");
            return;
        }
        setError("");
        setIsSubmitting(true);
        try {
            await submitTaskEvidence(id, photo[0]);
            setIsEvidenceOpen(false);
            setPhoto([]);
            onUpdated?.();
        } catch (err) {
            setError(err.message || "Error al enviar la evidencia");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div
                className="bg-white rounded-2xl flex flex-col justify-between border border-gray-100"
                style={{ padding: "16px 20px", minHeight: "110px", fontFamily: "var(--main-font)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
            >
                <div>
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading text-sm font-semibold truncate" style={{ color: "var(--color-primary-950)" }}>
                            {name}
                        </h3>
                        <span className={`shrink-0 text-[10px] px-2 py-1 rounded-full font-medium ${statusBadge.className}`}>
                            {statusBadge.label}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-gray-400">Entrega: {formatDate(dueDate)}</span>

                    {status === "Pendiente" && (
                        <Button variant="primary" size="sm" onClick={() => setIsEvidenceOpen(true)}>
                            Marcar como hecha
                        </Button>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isEvidenceOpen}
                title="Marcar tarea como hecha"
                onClose={() => { setIsEvidenceOpen(false); setError(""); setPhoto([]); }}
                onConfirm={handleSubmitEvidence}
                confirmText={isSubmitting ? "Enviando..." : "Enviar"}
                cancelText="Cancelar"
            >
                <p className="text-sm text-gray-600 mb-3">
                    Adjunta una foto que muestre que ya hiciste "{name}". Quien te la asignó va a revisarla y confirmar que quedó bien hecha.
                </p>
                <FileInput value={photo} onChange={setPhoto} multiple={false} accept="image/*" />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </Modal>
        </>
    );
}
