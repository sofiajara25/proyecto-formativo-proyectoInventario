import { useEffect } from "react";
import { Clock, LogOut } from "lucide-react";
import Button from "./Button";

const REASON_CONFIG = {
    expired: {
        icon: Clock,
        title: "Tu sesión expiró",
        message:
            "Por seguridad, las sesiones tienen un tiempo límite. Inicia sesión de nuevo para continuar.",
    },
    replaced: {
        icon: LogOut,
        title: "Tu sesión se cerró",
        message:
            "Se inició sesión con tu cuenta en otro lugar, así que esta sesión se cerró automáticamente.",
    },
    inactivity: {
        icon: Clock,
        title: "Sesión cerrada por inactividad",
        message:
            "Llevas un buen rato sin usar el sistema, así que por seguridad cerramos tu sesión. Inicia sesión de nuevo para continuar.",
    },
};

/**
 * Modal único para "la sesión terminó", reutilizado para las tres causas
 * posibles (token vencido, sesión reemplazada en otra pestaña, o
 * inactividad prolongada) — solo cambia el ícono/título/mensaje según
 * `reason`. Lo monta SessionModalProvider.jsx.
 */
export default function SessionEndedModal({ isOpen, reason, onAcknowledge }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onAcknowledge();
        };
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onAcknowledge]);

    if (!isOpen) return null;

    const config = REASON_CONFIG[reason] ?? REASON_CONFIG.expired;
    const Icon = config.icon;

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50"
            role="alertdialog"
            aria-modal="true"
        >
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4 flex flex-col">
                <div className="flex flex-col items-center text-center gap-3 px-6 pt-8 pb-6">
                    <Icon className="w-12 h-12 text-button-secondary-bg" aria-hidden="true" />
                    <h2 className="text-base font-semibold text-text-primary">{config.title}</h2>
                    <p className="text-sm text-text-secondary">{config.message}</p>
                </div>

                <div className="flex items-center justify-center px-6 pb-6">
                    <Button variant="primary" size="md" onClick={onAcknowledge} autoFocus>
                        Ir a iniciar sesión
                    </Button>
                </div>
            </div>
        </div>
    );
}
