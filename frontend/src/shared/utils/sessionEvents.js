// Bus para avisar que la sesión terminó (token vencido, sesión reemplazada
// en otra pestaña, o inactividad prolongada).
//
// Igual que alertBus.js: existe porque quien detecta que la sesión terminó
// no siempre es un componente de React. authFetchGuard.js, por ejemplo,
// envuelve window.fetch a nivel global y no puede usar hooks. SessionModalProvider
// (un componente React montado una sola vez) se registra acá como el único
// oyente real y muestra el modal correspondiente.
let listener = null;

export function setSessionEndHandler(handlerFn) {
    listener = handlerFn;
}

/**
 * Avisa que la sesión terminó y por qué.
 * @param {"expired"|"replaced"|"inactivity"} reason
 */
export function triggerSessionEnd(reason) {
    if (!listener) {
        console.warn("triggerSessionEnd llamado sin SessionModalProvider montado:", reason);
        return;
    }
    listener(reason);
}
