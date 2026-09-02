// Cerrar sesion eliminado JWT

import { clearAccess } from "@/shared/utils/permissions";
import { clearToken, getToken } from "@/shared/utils/tokenStorage";

const API_URL = "http://localhost:5000/api/auth";

export function logout() {
    const token = getToken();

    // Limpiar del lado del navegador primero: es lo que de verdad protege
    // las rutas (ProtectedRoute), así que no debe esperar a la respuesta
    // del backend para tener efecto.
    clearToken();
    clearAccess();

    // Avisa al backend para que libere la sesión activa (así se puede
    // volver a iniciar sesión en otra pestaña/navegador sin forzarlo).
    // No se espera la respuesta: si falla (ej. sin conexión), el usuario
    // ya cerró sesión igual del lado del navegador.
    if (token) {
        fetch(`${API_URL}/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        }).catch((err) => {
            console.error("Error avisando al backend del cierre de sesión:", err);
        });
    }
}