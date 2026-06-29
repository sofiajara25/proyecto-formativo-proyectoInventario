import { useEffect } from "react";
import { X } from "lucide-react";
import Button from "./Button";

export default function Modal({
    isOpen,
    title,
    onClose,
    onConfirm,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    showFooter = true,
    containerClassName = "",
    children,
}) {
    // Cierra con la tecla Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-2xl shadow-lg w-full max-w-md mx-4 flex flex-col ${containerClassName}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-base font-semibold text-text-primary">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-150 focus:outline-none"
                        aria-label="Cerrar modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    {children}
                </div>

                {/* Footer */}
                {showFooter && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onClose}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}