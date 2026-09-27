import { useCallback, useEffect, useState } from "react";
import AlertModal from "../components/AlertModal";
import { setAlertHandler } from "../utils/alertBus";

function inferTitle(type) {
    switch (type) {
        case "success":
            return "Éxito";
        case "error":
            return "Error";
        case "warning":
            return "Advertencia";
        default:
            return "Aviso";
    }
}

/**
 * Se monta una sola vez cerca de la raíz de la app (ver App.jsx). Se
 * registra en alertBus.js como el único manejador real de `showAlert(...)`,
 * y renderiza el modal correspondiente cuando alguien lo llama —
 * reemplazando así todos los `alert()` nativos que había antes.
 */
export default function AlertProvider({ children }) {
    const [alertState, setAlertState] = useState(null);

    const handleShowAlert = useCallback((message, options = {}) => {
        const type = options.type ?? "info";
        setAlertState({
            message,
            type,
            title: options.title || inferTitle(type),
        });
    }, []);

    useEffect(() => {
        setAlertHandler(handleShowAlert);
        return () => setAlertHandler(null);
    }, [handleShowAlert]);

    const closeAlert = useCallback(() => setAlertState(null), []);

    return (
        <>
            {children}
            <AlertModal
                isOpen={Boolean(alertState)}
                title={alertState?.title}
                message={alertState?.message}
                type={alertState?.type}
                onClose={closeAlert}
            />
        </>
    );
}
