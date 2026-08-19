const GROUPS_API_URL = "http://localhost:5000/api/groups";
const PERMISSIONS_API_URL = "http://localhost:5000/api/permissions";
const USER_PERMISSIONS_API_URL = "http://localhost:5000/api/users";
// import { getToken } from "@/shared/utils/tokenStorage";

export async function getGroupsPermissions(group_id) {
    const response = await fetch(`${GROUPS_API_URL}/${group_id}/permissions`);

    if (!response.ok) {
        throw new Error("Error  obteniendo grupos");
    }

    return response.json()

}

export async function getAllPermissions() {
    const response = await fetch(PERMISSIONS_API_URL);

    if (!response.ok) {
        throw new Error("Error obteniendo catalogo de permisos")
    }

    return response.json()

}

// permissionService.js (frontend)
export async function getUserPermissions(userId) {

    const response = await fetch(`${USER_PERMISSIONS_API_URL}/${userId}/permissions`);
    if (!response.ok) throw new Error("Error obteniendo permisos del usuario");
    return response.json();
}

export async function updateUserPermissions(userId, permissionIds) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${USER_PERMISSIONS_API_URL}/${userId}/permissions`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ permissionIds }),
    });
    if (!response.ok) throw new Error("Error actualizando permisos del usuario");
    return response.json();
}