// Bus de alertas global.
//
// Por qué existe esto: `alert()` nativo del navegador se usaba en toda la
// app (formularios, generadores de reportes, etc.) para mostrar errores y
// mensajes de éxito, pero muchos de esos usos están en archivos que NO son
// componentes de React (ej. features/*/reports/services/generate*Report.js
// son funciones de servicio normales), así que no pueden usar un hook ni
// un Context de React directamente.
//
// La solución es este pequeño "bus" imperativo: cualquier archivo (sea
// componente, hook o función suelta) puede llamar a `showAlert(mensaje)`
// para pedir que se muestre el modal de alerta. `AlertProvider` (montado
// una sola vez cerca de la raíz de la app) se registra como el único
// "oyente" real y es quien efectivamente actualiza el estado de React que
// controla el modal visible en pantalla.
let listener = null;

export function setAlertHandler(handlerFn) {
    listener = handlerFn;
}

/**
 * Muestra el modal de alerta global.
 * @param {string} message - Texto a mostrar.
 * @param {Object} [options]
 * @param {"info"|"success"|"error"|"warning"} [options.type="info"]
 * @param {string} [options.title] - Si no se da, se infiere del type.
 */
export function showAlert(message, options = {}) {
    if (!listener) {
        // AlertProvider todavía no se montó (o se quitó). No se pierde el
        // mensaje silenciosamente: se deja constancia en consola.
        console.warn("showAlert llamado sin AlertProvider montado:", message);
        return;
    }
    listener(message, options);
}
