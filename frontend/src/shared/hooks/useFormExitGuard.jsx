import { useCallback, useState } from "react";
import Modal from "../components/Modal";

// Convierte los datos del formulario a texto para poder compararlos. Los
// archivos (File) se representan por nombre y tamaño, porque JSON.stringify
// de un File da "{}" y no se notaría el cambio.
function serialize(data) {
    return JSON.stringify(data ?? null, (_key, value) =>
        value instanceof File ? `file:${value.name}:${value.size}` : value
    );
}

/**
 * Pregunta antes de salir de un formulario con datos ingresados.
 *
 * - requestExit(): para el botón "Cancelar" del formulario. Si la persona
 *   escribió o cambió algo, pregunta "¿Seguro que deseas salir?"; si no,
 *   sale directo.
 * - requestExit({ always: true }): para el "Cancelar" de la ventana de
 *   confirmación ("¿Seguro que deseas crear...?"): siempre vuelve a
 *   preguntar, porque a esa ventana solo se llega con datos ingresados.
 * - markClean(datos): en formularios de editar, se llama al terminar de
 *   cargar el registro, para que "lo que vino de la base de datos" no cuente
 *   como cambio.
 * - exitModal: la ventana de "¿Seguro que deseas salir?"; se pone en el JSX.
 *
 * @param {object} formData - Estado actual del formulario.
 * @param {Function} onExit - Qué hacer al salir (normalmente navigate(-1)).
 */
export function useFormExitGuard(formData, onExit) {
    const [baseline, setBaseline] = useState(() => serialize(formData));
    const [isExitOpen, setIsExitOpen] = useState(false);

    const isDirty = serialize(formData) !== baseline;

    const markClean = useCallback((data) => setBaseline(serialize(data)), []);

    const requestExit = ({ always = false } = {}) => {
        if (always || isDirty) {
            setIsExitOpen(true);
        } else {
            onExit();
        }
    };

    const exitModal = (
        <Modal
            isOpen={isExitOpen}
            title="¿Seguro que deseas salir?"
            onClose={() => setIsExitOpen(false)}
            onConfirm={() => {
                setIsExitOpen(false);
                onExit();
            }}
            confirmText="Sí, salir"
            cancelText="Seguir editando"
        >
            <p>Ya tienes datos ingresados. Si sales, se perderán y no se guardará nada.</p>
        </Modal>
    );

    return { isDirty, markClean, requestExit, exitModal };
}
