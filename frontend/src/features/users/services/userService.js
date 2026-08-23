// import { getToken } from "@/shared/utils/tokenStorage";

// URL base del endpoint de usuarios en el backend
// En desarrollo apunta al servidor Express local
// En producción debería provenir de variables de entorno
const API_URL = "http://localhost:5000/api/users";

// El formulario de creación guarda userPhoto como un File suelto (o null),
// mientras que el de edición lo guarda como arreglo (File nuevo, string con
// la ruta ya existente, o vacío). Esta función normaliza ambos casos y solo
// devuelve un File real para subir; si no hay uno nuevo, devuelve null.
function resolvePhotoFile(userPhoto) {
    if (userPhoto instanceof File) return userPhoto;
    if (Array.isArray(userPhoto) && userPhoto[0] instanceof File) return userPhoto[0];
    return null;
}


// Función para crear un usuario en el backend
// Recibe un objeto con los datos del usuario
// Retorna la respuesta JSON del servidor
export async function createUser(userData) {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();

    // SOLO UNA PASADA CONTROLADA
    formData.append("userName", userData.userName);
    formData.append("userLastname", userData.userLastname);
    formData.append("userDocumentType", userData.userDocumentType);
    formData.append("userDocumentNumber", userData.userDocumentNumber);
    formData.append("groupId", userData.groupId);
    formData.append("userStartDate", userData.userStartDate);
    formData.append("userEndDate", userData.userEndDate);
    formData.append("userEmail", userData.userEmail);
    formData.append("userAddress", userData.userAddress);
    formData.append("userPhone", userData.userPhone);
    formData.append("userStatus", userData.userStatus);
    formData.append("userPassword", userData.userPassword);

    // archivos. El backend solo acepta un archivo (upload.single).
    const newPhoto = resolvePhotoFile(userData.userPhoto);
    if (newPhoto) {
        formData.append("userPhoto", newPhoto);
    }


    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear usuario");
    }

    return response.json();
};

export async function getUsers() {
    const token = sessionStorage.getItem("token");
    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Error al obtener usuarios");
    return response.json();
};

export async function getUserById(id) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener usuario");
    return response.json();
};

export async function updateUser(id, userData) {
    const formData = new FormData();
    const token = sessionStorage.getItem("token");

    formData.append("userName", userData.userName);
    formData.append("userLastname", userData.userLastname);

    formData.append("userDocumentType", userData.userDocumentType);
    formData.append("userDocumentNumber", userData.userDocumentNumber);
    formData.append("groupId", userData.groupId);
    formData.append("userStartDate", userData.userStartDate);
    formData.append("userEndDate", userData.userEndDate);
    formData.append("userEmail", userData.userEmail);
    formData.append("userAddress", userData.userAddress);
    formData.append("userPhone", userData.userPhone);
    formData.append("userStatus", userData.userStatus);
    if (userData.userPassword) {
        formData.append("userPassword", userData.userPassword);
    }

    // Si sigue siendo el string original (no se tocó el campo), no se
    // reenvía nada y el backend conserva la foto actual.
    const newPhoto = resolvePhotoFile(userData.userPhoto);
    if (newPhoto) {
        formData.append("userPhoto", newPhoto);
    }



    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar usuario");
    }

    return response.json();
};

export async function updateUserStatus(id, userStatus) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userStatus }),
    });
    if (!response.ok) throw new Error("Error al actualizar estado");
    return response.json();
}




