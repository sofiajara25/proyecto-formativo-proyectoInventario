import { useCallback, useEffect, useState } from "react";
import SessionEndedModal from "../components/SessionEndedModal";
import { setSessionEndHandler } from "../utils/sessionEvents";
import { clearToken } from "../utils/tokenStorage";
import { clearAccess } from "../utils/permissions";

/**
 * Se monta una sola vez cerca de la raíz de la app (ver App.jsx). Se
 * registra en sessionEvents.js como el único manejador real de
 * `triggerSessionEnd(reason)`, y es quien de verdad limpia la sesión y
 * manda al login — pero solo DESPUÉS de que la persona ve el modal y le da
 * "Ir a iniciar sesión", no antes. Así el mensaje siempre se alcanza a
 * leer, en vez de que la pantalla cambie sola de golpe.
 */
export default function SessionModalProvider({ children }) {
    const [reason, setReason] = useState(null);

    const handleSessionEnd = useCallback((newReason) => {
        // Si ya hay un modal de sesión abierto (ej. dos peticiones 401
        // casi simultáneas), no hay que hacer nada más: ya se va a
        // limpiar la sesión cuando se confirme el primero.
        setReason((current) => current ?? newReason);
    }, []);

    useEffect(() => {
        setSessionEndHandler(handleSessionEnd);
        return () => setSessionEndHandler(null);
    }, [handleSessionEnd]);

    const acknowledge = useCallback(() => {
        clearToken();
        clearAccess();
        setReason(null);
        window.location.href = "/auth";
    }, []);

    return (
        <>
            {children}
            <SessionEndedModal isOpen={Boolean(reason)} reason={reason} onAcknowledge={acknowledge} />
        </>
    );
}
