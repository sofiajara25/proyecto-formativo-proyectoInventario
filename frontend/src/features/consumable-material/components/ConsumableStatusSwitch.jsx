import { useState } from "react";
import { Switch, Modal } from "@/shared";
import { updateConsumableStatus } from "../services/consumableMaterialService";
import { hasPermission } from "@/shared/utils/permissions";

export default function ConsumableStatusSwitch({ consumable }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nextValue, setNextValue] = useState(null);
    const [currentValue, setCurrentValue] = useState(consumable.status === "Activo");
    const canChangeState = hasPermission("state_consumable_material");

    // Cuando se toca el switch, no cambia aún: abre el modal
    const handleChange = (checked) => {
        setNextValue(checked);
        setIsModalOpen(true);
    };

    // Confirmar cambio
    const confirmChange = async () => {
        try {
            const newStatus = nextValue ? "Activo" : "Inactivo";
            const updated = await updateConsumableStatus(consumable.id, newStatus);
            setCurrentValue(updated.status === "Activo"); // actualiza el estado visual
            // 👇 no mutamos consumable directamente, dejamos que el padre refresque datos si hace falta
        } catch (err) {
            console.error("Error al actualizar estado:", err);
        } finally {
            setIsModalOpen(false);
            setNextValue(null);
        }
    };

    // Cancelar cambio → el switch se queda igual
    const cancelChange = () => {
        setIsModalOpen(false);
        setNextValue(null);
    };

    // Sin el permiso de habilitar/deshabilitar, se muestra el estado como
    // texto (informativo) en vez del switch interactivo.
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
                    ¿Seguro que deseas {nextValue ? "activar" : "desactivar"} este consumible?
                </p>
            </Modal>
        </>
    );
}
