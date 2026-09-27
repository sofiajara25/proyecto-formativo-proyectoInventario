import { useEffect, useRef } from "react";
import { isAuthenticated } from "../utils/tokenStorage";
import { triggerSessionEnd } from "../utils/sessionEvents";

// 20 minutos sin actividad -> se cierra la sesión por inactividad.
const IDLE_TIMEOUT_MS = 20 * 60 * 1000;

// Eventos que cuentan como "la persona sigue usando el sistema".
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

/**
 * Cierra la sesión (mostrando el modal de "sesión cerrada por
 * inactividad") si la persona no interactúa con la página en
 * IDLE_TIMEOUT_MS. Se monta una sola vez en App.jsx.
 *
 * Solo cuenta actividad mientras haya una sesión iniciada: si no hay
 * token, el temporizador ni siquiera arranca.
 */
export default function useIdleTimer() {
    const timeoutRef = useRef(null);

    useEffect(() => {
        function resetTimer() {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            if (!isAuthenticated()) return;

            timeoutRef.current = setTimeout(() => {
                triggerSessionEnd("inactivity");
            }, IDLE_TIMEOUT_MS);
        }

        // Arranca (o no, si no hay sesión) apenas se monta.
        resetTimer();

        ACTIVITY_EVENTS.forEach((eventName) => {
            window.addEventListener(eventName, resetTimer);
        });

        // Si en otra pestaña se inicia/cierra sesión, este también debe
        // reaccionar (ej. arrancar el temporizador recién después de un
        // login, o pararlo si se cierra sesión desde otro lado).
        window.addEventListener("auth-changed", resetTimer);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            ACTIVITY_EVENTS.forEach((eventName) => {
                window.removeEventListener(eventName, resetTimer);
            });
            window.removeEventListener("auth-changed", resetTimer);
        };
    }, []);
}
