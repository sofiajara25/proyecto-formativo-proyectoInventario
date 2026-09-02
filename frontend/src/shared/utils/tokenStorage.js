// Punto único de acceso al token de sesión.
//
// Por qué esto es más escalable que llamar sessionStorage.getItem("token")
// en cada archivo: un solo lugar para cambiar CÓMO se guarda el token
// (localStorage, cookies httpOnly en el futuro, etc.) sin tocar 15
// archivos distintos.
//
// Usamos sessionStorage (no localStorage) A PROPÓSITO: sessionStorage es
// exclusivo de cada pestaña, así que una pestaña nueva nunca ve la sesión
// de otra (por eso pegar un link del dashboard en una pestaña nueva manda
// al login, como debe ser). Esta es también la clave que usa Login.jsx al
// guardar el token — antes este archivo usaba localStorage por error, lo
// que hacía que "Cerrar sesión" no borrara el token real y se pudiera
// seguir entrando con el botón atrás/adelante del navegador.
//
// Disparamos un evento propio ("auth-changed") cada vez que el token
// cambia, para que la misma pestaña reaccione al instante (ej.
// AuthContext) — el evento nativo "storage" del navegador no sirve para
// esto porque solo se dispara en las OTRAS pestañas.

const TOKEN_KEY = "token";
const AUTH_EVENT = "auth-changed";

export function getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
}

export function isAuthenticated() {
    return Boolean(getToken());
}

// Nombre del evento, exportado para que otros módulos (ej. AuthContext)
// puedan suscribirse sin tener que repetir el string mágico.
export const AUTH_CHANGED_EVENT = AUTH_EVENT;
