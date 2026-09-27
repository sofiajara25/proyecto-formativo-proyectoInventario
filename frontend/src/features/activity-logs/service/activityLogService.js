const API_URL = "http://localhost:5000/api/activity-logs";

// Trae la bitácora de actividad (solo el Super Administrador tiene
// permiso en el backend para esta ruta).
export async function getActivityLogs() {
    const token = sessionStorage.getItem("token");
    const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al obtener la bitácora de actividad");
    return response.json();
}
