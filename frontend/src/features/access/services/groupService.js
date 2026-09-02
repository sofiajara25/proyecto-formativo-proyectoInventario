const API_URL = "http://localhost:5000/api/groups";
// import { getToken } from "@/shared/utils/tokenStorage";


export async function createGroup(groupData) {
    const token = sessionStorage.getItem("token");

    // Realizamos la petición HTTP usando fetch
    const response = await fetch(API_URL, {
        // Método HTTP según convención REST
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },


        // Convertimos el objeto userData a JSON
        body: JSON.stringify(groupData),
    });


    // Verificamos si la respuesta NO fue exitosa (status != 2xx)
    if (!response.ok) {
        // Leemos el cuerpo de la respuesta de error
        const error = await response.json();


        // Lanzamos una excepción con el mensaje de error
        // Esto permite que el componente que llama maneje el error con try/catch
        throw new Error(error.error || "Error al crear el grupo");
    }


    // Si la petición fue exitosa, retornamos la respuesta parseada como JSON
    return response.json();
};

export async function getGroups() {
    const token = sessionStorage.getItem("token");
    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error obteniendo grupos");
    }

    return response.json();
}

export async function updateGroupPermissions(groupId, permissionIds) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${API_URL}/${groupId}/permissions`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            permissionIds,
        }),
    });

    if (!response.ok) {
        throw new Error("Error actualizando permisos del grupo")
    }

    return response.json()
}