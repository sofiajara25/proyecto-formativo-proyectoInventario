const API_URL = "http://localhost:5000/api/tasks";

export async function createTask(taskData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            taskName: taskData.taskName,
            taskDescription: taskData.taskDescription,
            taskDeliveryDate: taskData.taskDeliveryDate,
            taskCreationDate: taskData.taskCreationDate,
            userId: taskData.userId,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear tarea");
    }

    return response.json();
}

// Obtener tareas por nombre de usuario
export async function getTasksByUserName(userName) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${API_URL}?userName=${encodeURIComponent(userName)}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al obtener tareas");
    }

    return response.json();
}

export async function getTasksByUserId(userId) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${API_URL}/user/${userId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al obtener tareas del usuario");
    }

    return response.json();
}

// Obtener todas las tareas
export async function getAllTasks() {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${API_URL}/all`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al obtener todas las tareas");
    }

    return response.json();
}

export async function updateTask(id, taskData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar tarea");
    }

    return response.json();
}

// Sube la foto de evidencia de que la tarea ya se hizo. La tarea queda
// "En revisión" hasta que quien la asignó la apruebe o la rechace.
export async function submitTaskEvidence(id, evidencePhoto) {
    const token = sessionStorage.getItem("token");

    const formData = new FormData();
    formData.append("evidencePhoto", evidencePhoto);

    const response = await fetch(`${API_URL}/${id}/evidence`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al enviar la evidencia");
    }

    return response.json();
}

// Quien creó la tarea la aprueba (approve: true) o la rechaza (approve:
// false, vuelve a quedar pendiente).
export async function confirmTask(id, approve) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${API_URL}/${id}/confirm`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approve }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al confirmar la tarea");
    }

    return response.json();
}

// Tareas que el usuario logueado creó/asignó y que están esperando su
// confirmación (ya se subió evidencia). Se usa en la campana del navbar.
export async function getTasksPendingConfirmation() {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${API_URL}/pending-confirmation/mine`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al obtener las tareas por confirmar");
    }

    return response.json();
}
