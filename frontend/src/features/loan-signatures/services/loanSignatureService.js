// Estas dos llamadas son públicas (sin token de sesión): quien firma puede
// no tener cuenta en el sistema.
const API_URL = "http://localhost:5000/api/loan-signatures";

export async function getLoanSignature(token) {
    const response = await fetch(`${API_URL}/${token}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Enlace inválido o expirado");
    }
    return response.json();
}

export async function acceptLoanSignature(token) {
    const response = await fetch(`${API_URL}/${token}/accept`, {
        method: "POST",
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "No se pudo aceptar el préstamo");
    }
    return response.json();
}
