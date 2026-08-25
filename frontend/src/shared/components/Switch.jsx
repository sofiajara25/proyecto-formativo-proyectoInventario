// import { useState, useEffect } from "react";

import { Check, X, } from "lucide-react";

// Componente Switch controlado completamente por el padre
// 👉 Ya no mantiene estado interno propio, solo refleja la prop "checked"
export default function Switch({
    checked = false,    // valor actual del switch (controlado desde el padre)
    onChange,           // callback que se ejecuta cuando el padre decide cambiar
    disabled = false,   // permite deshabilitar la interacción
    size = "md",        // tamaño del switch (sm, md, lg)
    className,
}) {
    // clases de tamaño del contenedor
    const sizes = {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
    };

    // clases de tamaño del "knob" (círculo que se mueve)
    const knobSizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    };

    // función que notifica al padre el cambio
    const handleToggle = () => {
        if (disabled) return; // si está deshabilitado, no hace nada
        if (onChange) {
            onChange(!checked); // solo avisa al padre, no cambia nada aquí
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={disabled}
            className={`
        relative inline-flex items-center shrink-0 rounded-full transition-colors
        ${sizes[size]}
        ${checked ? "bg-green-500" : "bg-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
        >
            {/* "top-0.5" centra el knob verticalmente igual que "left-0.5" lo
                hace horizontalmente; sin esto, al no tener "top" definido, el
                navegador lo dejaba en su posición estática (no centrado) y
                se veía como un círculo grande desbordando la píldora. */}
            <span
                className={`
          absolute left-0.5 top-0.5 flex items-center justify-center
          rounded-full bg-white shadow transition-transform
          ${knobSizes[size]}
          ${checked ? "translate-x-full" : "translate-x-0"}
        `}
            >
                {/* Icono dinámico según estado */}
                {checked ? (
                    <Check size={12} className="text-green-600" />
                ) : (
                    <X size={12} className="text-gray-500" />
                )}
            </span>
        </button>
    );
}
