import { useState } from "react";
import { Switch, Modal } from "@/shared";
import { updateQuotationStatus } from "../services/quotationService";

export default function QuotationStatusSwitch({ quotation }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nextValue, setNextValue] = useState(null);
    const [currentValue, setCurrentValue] = useState(quotation.status === "Activo");

    const handleChange = (checked) => {
        setNextValue(checked);
        setIsModalOpen(true);
    };

    const confirmChange = async (e) => {
        e?.stopPropagation?.();
        try {
            const newStatus = nextValue ? "Activo" : "Inactivo";
            const updated = await updateQuotationStatus(quotation.quotation_id, newStatus);
            setCurrentValue(updated.status === "Activo");
        } catch (err) {
            console.error("Error al actualizar estado:", err);
        } finally {
            setIsModalOpen(false);
            setNextValue(null);
        }
    };

    const cancelChange = (e) => {
        e?.stopPropagation?.();
        setIsModalOpen(false);
        setNextValue(null);
    };

    return (
        // stopPropagation: la tarjeta que envuelve esto no debe reaccionar
        // al clic (no tiene onClick propio, pero por si acaso en el futuro).
        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{currentValue ? "Activo" : "Inactivo"}</span>
            <Switch checked={currentValue} onChange={handleChange} size="sm" />

            <Modal
                isOpen={isModalOpen}
                title="Confirmar cambio de estado"
                onClose={cancelChange}
                onConfirm={confirmChange}
                confirmText="Sí, confirmar"
                cancelText="Cancelar"
            >
                <p>¿Seguro que deseas {nextValue ? "activar" : "desactivar"} esta cotización?</p>
            </Modal>
        </div>
    );
}
