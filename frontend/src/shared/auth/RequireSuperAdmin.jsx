// frontend/src/shared/auth/RequireSuperAdmin.jsx
//
// Guard de ruta exclusivo del Super Administrador: se usa para Grupos y
// Permisos, que solo esa persona puede ver o modificar. Es independiente
// de RequirePermission (permisos normales) y no se combina con ellos.
//
// OJO: esto es solo para que no se vea/entre a la pantalla — la
// protección real está en el backend (ver requireSuperAdmin en
// backend/src/middlewares/permission.middleware.js), porque esto se
// puede saltar editando el navegador.
import { Navigate } from "react-router-dom";
import { isSuperAdmin } from "@/shared/utils/permissions";

export default function RequireSuperAdmin({ redirectTo = "/dashboard/home", children }) {
    if (!isSuperAdmin()) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}
