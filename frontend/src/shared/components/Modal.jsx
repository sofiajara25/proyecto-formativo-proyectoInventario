// src/shared/components/Modal.jsx

import { useRef } from "react";
import { X } from "lucide-react";

export function Modal({
    open = false,
    onClose,
    title,
    children,
    footer,
    className = "",
}) {
    const overlayRef = useRef(null);

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) {
            onClose?.();
        }
    };

    if (!open) return null;

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className={`
                    relative
                    w-full
                    max-w-lg
                    rounded-2xl
                    bg-white
                    shadow-xl
                    ${className}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2
                        id="modal-title"
                        className="text-base font-semibold text-neutral-900"
                    >
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar modal"
                        className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Modal;