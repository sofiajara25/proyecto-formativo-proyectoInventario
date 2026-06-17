const API_URL = "http://localhost:5000/api/groups";

export async function getGroups() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Error obteniendo grupos");
    }

    return response.json();
}

export async function createGroup(groupData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error creando grupo");
    }

    return response.json();
}
