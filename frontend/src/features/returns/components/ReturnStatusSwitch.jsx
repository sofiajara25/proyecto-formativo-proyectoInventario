import { useState } from "react";
import { Switch, Modal } from "@/shared";
import { updateReturnStatus } from "../services/returnService";
import { hasPermission } from "@/shared/utils/permissions";

export default function ReturnStatusSwitch({ refund }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nextValue, setNextValue] = useState(null);
    const [currentValue, setCurrentValue] = useState(refund.is_available);
    const canChangeState = hasPermission("state_return");

    const handleChange = (value) => {
        setNextValue(value);      // guarda el nuevo valor propuesto
        setIsModalOpen(true);     // abre el modal
    };

    const confirmChange = async () => {
        try {
            const updated = await updateReturnStatus(refund.id, nextValue);
            setCurrentValue(updated.is_available); // ✅ el switch se actualiza
            // ❌ no mutar refund directamente
        } catch (err) {
            console.error("Error al actualizar estado:", err);
        } finally {
            setIsModalOpen(false);
            setNextValue(null);
        }
    };

    const cancelChange = () => {
        setIsModalOpen(false);
        setNextValue(null);
        // 👇 el switch se mantiene en currentValue (no cambia visualmente)
    };

    if (!canChangeState) {
        return (
            <span className="text-xs font-medium" style={{ color: currentValue ? "#15803d" : "#b91c1c" }}>
                {currentValue ? "Activo" : "Inactivo"}
            </span>
        );
    }

    return (
        <>
            <Switch
                checked={currentValue}
                onChange={handleChange}
                className="inline-flex"
            />

            <Modal
                isOpen={isModalOpen}
                title="Confirmar cambio de estado"
                onClose={cancelChange}
                onConfirm={confirmChange}
                confirmText="Sí, confirmar"
                cancelText="Cancelar"
            >
                <p>
                    ¿Seguro que deseas {nextValue ? "activar" : "desactivar"} esta devolución?
                </p>
            </Modal>
        </>
    );
}
