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
