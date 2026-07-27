// URL base del endpoint de usuarios en el backend
// En desarrollo apunta al servidor Express local
// En producción debería provenir de variables de entorno
const API_URL = "http://localhost:5000/api/users";


// Función para crear un usuario en el backend
// Recibe un objeto con los datos del usuario
// Retorna la respuesta JSON del servidor
export async function createUser(userData) {
    const formData = new FormData();
    const token = sessionStorage.getItem("token");

    // SOLO UNA PASADA CONTROLADA
    formData.append("userName", userData.userName);
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

    // archivos
    if (userData.userPhoto?.length) {
        userData.userPhoto.forEach((file) => {
            formData.append("userPhoto", file);
        });
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

    if (Array.isArray(userData.userPhoto) && userData.userPhoto.length) {
        formData.append("userPhoto", userData.userPhoto[0]);
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





