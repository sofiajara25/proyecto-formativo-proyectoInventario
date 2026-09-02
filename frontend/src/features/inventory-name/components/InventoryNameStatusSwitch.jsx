import { useState } from "react";
import { Switch, Modal } from "@/shared";
import { updateInventoryNameStatus } from "../services/inventoryNameService";
import { hasPermission } from "@/shared/utils/permissions";


export default function InventoryNameStatusSwitch({ inventoryName }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nextValue, setNextValue] = useState(null);
    const [currentValue, setCurrentValue] = useState(inventoryName.status === "Activo");
    const canChangeState = hasPermission("state_inventory_name");

    const handleChange = (checked) => {
        setNextValue(checked);
        setIsModalOpen(true); // abre modal
    };

    const confirmChange = async () => {
        try {
            const newStatus = nextValue ? "Activo" : "Inactivo";
            const updated = await updateInventoryNameStatus(inventoryName.id, newStatus);
            setCurrentValue(updated.status === "Activo"); // ✅ actualiza visual
            // ❌ no mutar inventoryName.status directamente
        } catch (err) {
            console.error("Error al actualizar estado:", err);
        } finally {
            setIsModalOpen(false);
            setNextValue(null);
        }
    };

    const cancelChange = () => {
        setIsModalOpen(false);
        setNextValue(null); // switch se queda igual
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
                    ¿Seguro que deseas {nextValue ? "activar" : "desactivar"} este nombre de inventario?
                </p>
            </Modal>
        </>
    );
}
