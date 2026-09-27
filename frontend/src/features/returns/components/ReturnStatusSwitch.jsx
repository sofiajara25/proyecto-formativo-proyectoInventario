import { useState } from "react";
import { Modal } from "@/shared";
import { updateReturnStatus } from "../services/returnService";
import { hasPermission } from "@/shared/utils/permissions";
import { showAlert } from "@/shared/utils/alertBus";

// Antes esto era un switch binario (activo/inactivo) sobre "is_available",
// que no dejaba elegir "Mantenimiento" desde acá una vez creada la
// devolución. Ahora el estado real tiene 3 valores, así que es un select
// en vez de un switch de dos posiciones.
const STATUS_OPTIONS = ["Disponible", "Mantenimiento", "Baja"];
const STATUS_COLORS = {
    Disponible: "#15803d",
    Mantenimiento: "#b45309",
    Baja: "#b91c1c",
};

export default function ReturnStatusSwitch({ refund }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nextValue, setNextValue] = useState(null);
    const [currentValue, setCurrentValue] = useState(refund.status);
    const canChangeState = hasPermission("state_return");

    const handleChange = (e) => {
        const value = e.target.value;
        if (value === currentValue) return;
        setNextValue(value);      // guarda el nuevo valor propuesto
        setIsModalOpen(true);     // abre el modal
    };

    const confirmChange = async () => {
        try {
            const updated = await updateReturnStatus(refund.id, nextValue);
            setCurrentValue(updated.status); // ✅ el select se actualiza
            // ❌ no mutar refund directamente
        } catch (err) {
            console.error("Error al actualizar estado:", err);
            showAlert(err.message || "Error al actualizar el estado de la devolución", { type: "error" });
        } finally {
            setIsModalOpen(false);
            setNextValue(null);
        }
    };

    const cancelChange = () => {
        setIsModalOpen(false);
        setNextValue(null);
        // 👇 el select se mantiene en currentValue (no cambia visualmente)
    };

    if (!canChangeState) {
        return (
            <span className="text-xs font-medium" style={{ color: STATUS_COLORS[currentValue] || "#4b5563" }}>
                {currentValue}
            </span>
        );
    }

    return (
        <>
            <select
                value={currentValue}
                onChange={handleChange}
                className="text-xs font-medium rounded-md border border-gray-300 px-2 py-1 bg-white"
                style={{ color: STATUS_COLORS[currentValue] || "#4b5563" }}
            >
                {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>

            <Modal
                isOpen={isModalOpen}
                title="Confirmar cambio de estado"
                onClose={cancelChange}
                onConfirm={confirmChange}
                confirmText="Sí, confirmar"
                cancelText="Cancelar"
            >
                <p>
                    ¿Seguro que deseas cambiar el estado a "{nextValue}"?
                </p>
            </Modal>
        </>
    );
}
