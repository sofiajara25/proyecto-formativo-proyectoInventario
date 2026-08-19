// Provider de autenticación.
//
// Por qué esto es "escalable": en vez de que cada componente lea
// localStorage por su cuenta (y se le pueda olvidar, o quede inconsistente),
// hay un solo lugar que sabe si hay sesión activa. Cuando el proyecto crezca
// y necesites, por ejemplo, refrescar el token automáticamente, mostrar el
// nombre del usuario en el Navbar, o cerrar sesión por inactividad, todo
// eso se agrega aquí UNA vez y automáticamente lo tienen todos los
// componentes que usan useAuth().
//
// También es lo que hace posible el "cierre de sesión en todas las
// pestañas a la vez": si cierras sesión en una pestaña, las demás se
// enteran solas (vía el evento "storage") y te mandan al login.

import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./authContext";
import { getToken, setToken, clearToken, AUTH_CHANGED_EVENT } from "../utils/tokenStorage";
import { saveAccess, clearAccess } from "../utils/permissions";

export function AuthProvider({ children }) {
    // Se inicializa leyendo lo que ya haya en localStorage (por si recargan
    // la página, o entran directo a una URL estando ya logueados).
    const [token, setTokenState] = useState(() => getToken());

    // Vuelve a leer el token desde localStorage y actualiza el estado.
    // Se usa tanto para el evento propio (misma pestaña) como para el
    // evento nativo "storage" (otras pestañas).
    const syncFromStorage = useCallback(() => {
        setTokenState(getToken());
    }, []);

    useEffect(() => {
        // Cambios hechos DESDE ESTA MISMA pestaña (login/logout aquí mismo)
        window.addEventListener(AUTH_CHANGED_EVENT, syncFromStorage);

        // Cambios hechos DESDE OTRA pestaña (ej. cerraste sesión allá)
        window.addEventListener("storage", syncFromStorage);

        return () => {
            window.removeEventListener(AUTH_CHANGED_EVENT, syncFromStorage);
            window.removeEventListener("storage", syncFromStorage);
        };
    }, [syncFromStorage]);

    // Se llama justo después de un login exitoso
    const login = useCallback((newToken, access) => {
        setToken(newToken);
        if (access) saveAccess(access);
        setTokenState(newToken);
    }, []);

    // Se llama al cerrar sesión (desde cualquier pestaña)
    const logout = useCallback(() => {
        clearToken();
        clearAccess();
        setTokenState(null);
    }, []);

    const value = {
        token,
        isAuthenticated: Boolean(token),
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
