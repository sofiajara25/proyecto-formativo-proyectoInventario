const API_URL = "http://localhost:5000/api/access";
// import { getToken } from "@/shared/utils/tokenStorage";


export async function hasPermission(permissionCode) {
    const token = sessionStorage.setItem("token");

    const response = await fetch(`${API_URL}/check/${permissionCode}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });


    if (!response.ok) {
        throw new Error("Error verficando permiso");
    }

    return response.json();
}

// Devuelve el resumen de acceso del usuario logueado:
// { userType, isAdmin, permissions: [...] }
// Se usa justo después del login para saber qué módulos mostrar.
export async function getMyAccess() {
    const token = sessionStorage.setItem("token")

    const response = await fetch(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("No se pudo obtener el acceso del usuario");
    }

    return response.json();
}