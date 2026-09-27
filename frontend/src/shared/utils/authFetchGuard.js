// Interceptor global de fetch: como el proyecto no tiene un cliente HTTP
// centralizado (cada service hace su propio fetch(...) suelto), la forma
// más simple de reaccionar en TODA la app cuando el backend dice "esta
// sesión ya no es válida" es "envolver" el fetch nativo una sola vez acá,
// en vez de tocar decenas de archivos de servicios.
//
// Esto es lo que realmente saca a una sesión cuando, desde otra pestaña o
// navegador, alguien le da "Cerrar la otra sesión e iniciar aquí": el
// backend empieza a responder 401 con code "SESSION_REPLACED" en TODAS
// las peticiones de la sesión vieja (ver auth.middleware.js), y la
// primera petición que haga esa pestaña (o la campana de notificaciones,
// que consulta cada tanto) dispara este interceptor, que cierra sesión y
// manda al login.
import { triggerSessionEnd } from "./sessionEvents";

const nativeFetch = window.fetch.bind(window);

function getRequestUrl(input) {
    if (typeof input === "string") return input;
    if (input instanceof URL) return input.toString();
    return input?.url ?? "";
}

// Traduce el "code" que manda el backend (ver auth.middleware.js) a la
// razón que entiende el modal de sesión finalizada (SessionEndedModal.jsx).
function reasonFromCode(code) {
    if (code === "SESSION_REPLACED") return "replaced";
    if (code === "TOKEN_EXPIRED") return "expired";
    return "expired"; // token inválido / faltante: se trata igual que expirado
}

window.fetch = async (...args) => {
    const response = await nativeFetch(...args);

    if (response.status === 401) {
        const url = getRequestUrl(args[0]);

        // El login mismo también responde 401 cuando la contraseña es
        // incorrecta: eso no significa "te echaron de una sesión", así
        // que no hay que interceptarlo.
        const isLoginAttempt = url.includes("/api/auth/login");

        if (!isLoginAttempt && !window.location.pathname.startsWith("/auth")) {
            // Se usa clone() porque el código que hizo el fetch original
            // también va a querer leer este mismo response (ej. su propio
            // .json() en el catch) — sin clonar, ese segundo intento de
            // lectura del body fallaría.
            let code;
            try {
                const body = await response.clone().json();
                code = body?.code;
            } catch {
                // Respuesta sin JSON válido: se sigue tratando como sesión
                // terminada de todas formas.
            }

            triggerSessionEnd(reasonFromCode(code));
        }
    }

    return response;
};
