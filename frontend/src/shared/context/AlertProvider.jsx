import { useCallback, useEffect, useRef, useState } from "react";
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
    // Callback opcional que se ejecuta una sola vez al cerrarse la alerta
    // (ej. volver a la lista después de "creado con éxito").
    const onCloseRef = useRef(null);

    const handleShowAlert = useCallback((message, options = {}) => {
        const type = options.type ?? "info";
        onCloseRef.current = options.onClose ?? null;
        setAlertState({
            message,
            type,
            title: options.title || inferTitle(type),
            autoCloseMs: options.autoCloseMs ?? null,
        });
    }, []);

    useEffect(() => {
        setAlertHandler(handleShowAlert);
        return () => setAlertHandler(null);
    }, [handleShowAlert]);

    const closeAlert = useCallback(() => {
        setAlertState(null);
        const callback = onCloseRef.current;
        onCloseRef.current = null;
        callback?.();
    }, []);

    // Alertas que se cierran solas (ej. las de éxito): pasado el tiempo,
    // se cierran igual que si se hubiera presionado "Aceptar".
    useEffect(() => {
        if (!alertState?.autoCloseMs) return;
        const timer = setTimeout(closeAlert, alertState.autoCloseMs);
        return () => clearTimeout(timer);
    }, [alertState, closeAlert]);

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
