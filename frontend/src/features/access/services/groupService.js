const API_URL = "http://localhost:4000/api/groups";

export async function getGroups() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Error obteniendo grupos");
    }

    return response.json();
}