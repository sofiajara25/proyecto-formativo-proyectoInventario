// frontend/src/shared/auth/GuestRoute.jsx
//
// Lo opuesto a ProtectedRoute: esta ruta es solo para quien NO ha iniciado
// sesión (ej. la pantalla de login). Si detecta que ya hay un token válido
// guardado, redirige directo al dashboard en vez de mostrar el login.
//
// Esto cubre dos casos:
// 1. Abrir la app en una pestaña nueva estando ya logueado en otra: no
//    vuelve a mostrar el formulario de login, te manda directo al dashboard.
// 2. Usar el botón "atrás" del navegador para volver al login estando
//    logueado: en vez de quedarte ahí, te regresa al dashboard.

import { Navigate } from "react-router-dom";
import { useAuth } from "@/shared/context/useAuth";

export default function GuestRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard/home" replace />;
    }

    return children;
}
