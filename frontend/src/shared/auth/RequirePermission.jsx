// frontend/src/shared/auth/RequirePermission.jsx
//
// Guard de ruta por permiso: además de estar logueado (eso ya lo revisa
// ProtectedRoute más arriba en el árbol de rutas), exige un permiso
// puntual para poder ver esa página. Si no lo tiene, lo manda de vuelta
// al listado en vez de mostrarle el formulario.
//
// OJO: esto es solo para que no se vea/entre a un formulario que de
// todos modos le va a fallar al guardar — la protección real está en el
// backend (ver requirePermission en backend/src/middlewares), porque
// esto se puede saltar editando el navegador.
import { Navigate } from "react-router-dom";
import { hasPermission } from "@/shared/utils/permissions";

export default function RequirePermission({ permission, redirectTo = "/dashboard/home", children }) {
    if (!hasPermission(permission)) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}
