// Cerrar sesion eliminado JWT

import { clearAccess } from "@/shared/utils/permissions";
import { clearToken } from "@/shared/utils/tokenStorage";

export function logout() {
    clearToken();
    clearAccess();
}