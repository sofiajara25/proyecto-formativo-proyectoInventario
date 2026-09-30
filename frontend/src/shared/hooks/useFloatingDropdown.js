import { useEffect, useState } from "react";

// Posición de un desplegable (Select, MultiSelect) que se dibuja en <body>
// con "position: fixed", pegado al campo que lo abre (anchorRef).
//
// Por qué: si el desplegable se dibuja dentro de un contenedor con scroll
// propio (ej. la ventana "Asignar tarea"), ese contenedor lo recorta y la
// rueda del mouse mueve la ventana en vez de la lista. Dibujado en <body>
// queda por encima de todo y nunca se corta.
//
// Si no cabe hacia abajo (poco espacio hasta el borde de la pantalla), se
// abre hacia arriba.
const GAP = 4;
const SCREEN_MARGIN = 8;

function computePosition(anchor, desiredHeight) {
    const rect = anchor.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - SCREEN_MARGIN;
    const spaceAbove = rect.top - SCREEN_MARGIN;
    const openUp = spaceBelow < desiredHeight && spaceAbove > spaceBelow;

    return {
        position: "fixed",
        left: rect.left,
        width: rect.width,
        maxHeight: Math.max(120, Math.min(desiredHeight, openUp ? spaceAbove : spaceBelow)),
        zIndex: 1000,
        ...(openUp
            ? { bottom: window.innerHeight - rect.top + GAP }
            : { top: rect.bottom + GAP }),
    };
}

// Devuelve { style, updatePosition }:
// - updatePosition(): se llama al abrir el desplegable (desde el click).
// - style: estilos para el contenedor del desplegable (null si está cerrado).
// Mientras está abierto, se reubica solo al hacer scroll o cambiar el tamaño
// de la ventana.
export function useFloatingDropdown(anchorRef, isOpen, desiredHeight = 290) {
    const [style, setStyle] = useState(null);

    const updatePosition = () => {
        if (anchorRef.current) setStyle(computePosition(anchorRef.current, desiredHeight));
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleReposition = () => {
            if (anchorRef.current) setStyle(computePosition(anchorRef.current, desiredHeight));
        };

        // "true" (captura): también se entera del scroll de contenedores
        // internos, como la ventana con scroll donde está el campo.
        window.addEventListener("scroll", handleReposition, true);
        window.addEventListener("resize", handleReposition);
        return () => {
            window.removeEventListener("scroll", handleReposition, true);
            window.removeEventListener("resize", handleReposition);
        };
    }, [isOpen, anchorRef, desiredHeight]);

    return { style: isOpen ? style : null, updatePosition };
}
