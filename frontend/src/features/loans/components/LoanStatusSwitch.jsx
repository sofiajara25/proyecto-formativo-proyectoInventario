import { useState } from "react";
import { Switch, Modal } from "@/shared";
import { updateLoanStatus } from "../services/loanService";

export default function LoanStatusSwitch({ loan }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nextValue, setNextValue] = useState(null);
    const [currentValue, setCurrentValue] = useState(loan.is_active);
    const [previousValue, setPreviousValue] = useState(loan.is_active);

    const handleChange = (value) => {
        setPreviousValue(currentValue);   // guarda el valor actual antes de cambiar
        setNextValue(value);              // guarda el nuevo valor propuesto
        setIsModalOpen(true);             // abre el modal
    };

    const confirmChange = async () => {
        try {
            await updateLoanStatus(loan.loan_id, nextValue);
            setCurrentValue(nextValue); // ✅ el switch se actualiza
            // ❌ no mutar loan.is_active directamente
        } catch (error) {
            console.error("Error actualizando estado:", error.message);
            setCurrentValue(previousValue); // vuelve al valor anterior si falla
        } finally {
            setIsModalOpen(false);
            setNextValue(null);
        }
    };

    const cancelChange = () => {
        setIsModalOpen(false);
        setCurrentValue(previousValue);   // vuelve al valor anterior
        setNextValue(null);
    };

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
                    ¿Seguro que deseas {nextValue ? "activar" : "desactivar"} este préstamo?
                </p>
            </Modal>
        </>
    );
}
