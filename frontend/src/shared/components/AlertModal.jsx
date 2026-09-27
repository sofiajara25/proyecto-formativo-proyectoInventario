import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import Button from "./Button";

const TYPE_CONFIG = {
    info: {
        icon: Info,
        iconClassName: "text-blue-500",
        defaultTitle: "Aviso",
    },
    success: {
        icon: CheckCircle2,
        iconClassName: "text-green-500",
        defaultTitle: "Éxito",
    },
    error: {
        icon: XCircle,
        iconClassName: "text-red-500",
        defaultTitle: "Error",
    },
    warning: {
        icon: AlertTriangle,
        iconClassName: "text-yellow-500",
        defaultTitle: "Advertencia",
    },
};

/**
 * Modal de alerta de un solo botón: reemplaza al `alert()` nativo del
 * navegador. Visualmente sigue el mismo lenguaje que Modal.jsx (fondo
 * oscuro, tarjeta blanca redondeada), pero solo tiene un botón "Aceptar" en
 * vez de confirmar/cancelar.
 */
export default function AlertModal({ isOpen, title, message, type = "info", onClose }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;
    const Icon = config.icon;
    const resolvedTitle = title || config.defaultTitle;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4 flex flex-col"
                onClick={(e) => e.stopPropagation()}
                role="alertdialog"
                aria-modal="true"
            >
                <div className="flex flex-col items-center text-center gap-3 px-6 pt-8 pb-6">
                    <Icon className={`w-12 h-12 ${config.iconClassName}`} aria-hidden="true" />
                    <h2 className="text-base font-semibold text-text-primary">{resolvedTitle}</h2>
                    <p className="text-sm text-text-secondary whitespace-pre-line">{message}</p>
                </div>

                <div className="flex items-center justify-center px-6 pb-6">
                    <Button variant="primary" size="md" onClick={onClose} autoFocus>
                        Aceptar
                    </Button>
                </div>
            </div>
        </div>
    );
}
