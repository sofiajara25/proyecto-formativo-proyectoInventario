// Punto único de acceso al token de sesión.
//
// Por qué esto es más escalable que llamar sessionStorage.getItem("token")
// en cada archivo:
// 1. Un solo lugar para cambiar CÓMO se guarda el token (localStorage,
//    cookies httpOnly en el futuro, etc.) sin tocar 15 archivos distintos.
// 2. Usamos localStorage (no sessionStorage): sessionStorage es exclusivo
//    de cada pestaña, así que una pestaña nueva NUNCA vería la sesión de
//    otra. localStorage sí se comparte entre todas las pestañas del mismo
//    sitio, que es lo que se necesita para "ya inicié sesión en otra pestaña".
// 3. Disparamos un evento propio ("auth-changed") cada vez que el token
//    cambia. El evento nativo "storage" del navegador SOLO se dispara en
//    las OTRAS pestañas, nunca en la que hizo el cambio — con este evento
//    propio, hasta la misma pestaña reacciona al instante (ej. AuthContext).

const TOKEN_KEY = "token";
const AUTH_EVENT = "auth-changed";

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
}

export function isAuthenticated() {
    return Boolean(getToken());
}

// Nombre del evento, exportado para que otros módulos (ej. AuthContext)
// puedan suscribirse sin tener que repetir el string mágico.
export const AUTH_CHANGED_EVENT = AUTH_EVENT;
