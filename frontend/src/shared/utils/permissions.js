// Utilidades para consultar los permisos del usuario logueado.
// El resumen de acceso se guarda justo después del login (ver
// features/auth/components/Login.jsx), bajo la clave "access":
// { userType, isAdmin, permissions: [] }
//
// Usamos localStorage (no sessionStorage) para que, igual que el token,
// el acceso se comparta entre todas las pestañas del mismo sitio.
// Ver shared/utils/tokenStorage.js para la explicación completa.

import { AUTH_CHANGED_EVENT } from "./tokenStorage";

const STORAGE_KEY = "access";

// Guarda el resumen de acceso (llamar justo después del login)
export function saveAccess(access) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(access));
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

// Borra el resumen de acceso (llamar al cerrar sesión)
export function clearAccess() {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

// Lee el resumen de acceso guardado. Si no existe (ej. sesión vieja
// antes de este cambio), devuelve un acceso "vacío" por seguridad:
// sin permisos y sin ser admin, para no mostrar de más por error.
function getAccess() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        return { userType: null, isAdmin: false, permissions: [] };
    }

    try {
        return JSON.parse(raw);
    } catch {
        return { userType: null, isAdmin: false, permissions: [] };
    }
}

// true si el usuario logueado es Administrador (acceso total)
export function isAdmin() {
    return getAccess().isAdmin === true;
}

// true si el usuario logueado puede realizar la acción indicada
// (permiso directo, heredado por grupo, o si es Administrador)
export function hasPermission(permissionCodename) {
    const access = getAccess();

    if (access.isAdmin) return true;

    return access.permissions.includes(permissionCodename);
}
