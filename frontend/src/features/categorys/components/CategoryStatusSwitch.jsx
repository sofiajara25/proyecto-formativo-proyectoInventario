import { useState } from "react";
import { Switch, Modal } from "@/shared";
import { updateCategoryStatus } from "../service/categoryService";
import { hasPermission } from "@/shared/utils/permissions";
import { showAlert } from "@/shared/utils/alertBus";

export default function CategoryStatusSwitch({ category }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nextValue, setNextValue] = useState(null);
    const [currentValue, setCurrentValue] = useState(category.status === "Activo");
    const canChangeState = hasPermission("state_category");

    const handleChange = (checked) => {
        setNextValue(checked);
        setIsModalOpen(true); // abre modal
    };

    const confirmChange = async () => {
        try {
            const newStatus = nextValue ? "Activo" : "Inactivo";
            // Antes usaba category.id, que no existe (la PK es category_id):
            // la petición salía sin id y el cambio de estado nunca funcionaba.
            const updated = await updateCategoryStatus(category.category_id, newStatus);
            setCurrentValue(updated.status === "Activo"); // ✅ actualiza visual
            // ❌ no mutar category.status directamente
        } catch (err) {
            console.error("Error al actualizar estado:", err);
            showAlert(err.message || "Error al actualizar el estado de la categoría", { type: "error" });
        } finally {
            setIsModalOpen(false);
            setNextValue(null);
        }
    };

    const cancelChange = () => {
        setIsModalOpen(false);
        setNextValue(null); // switch se queda igual
    };

    // Las 3 categorías por defecto deben estar siempre activas: no se
    // muestra el switch (el backend igual rechazaría desactivarlas).
    if (category.is_default) {
        return (
            <span className="text-xs font-medium" style={{ color: "#15803d" }} title="Categoría por defecto: siempre activa">
                Activo
            </span>
        );
    }

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
                    ¿Seguro que deseas {nextValue ? "activar" : "desactivar"} esta categoría?
                </p>
            </Modal>
        </>
    );
}
