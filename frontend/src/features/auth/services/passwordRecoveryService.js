// Consumir Api recuperación de contraseña

const API_URL = "http://localhost:5000/api/auth";

// Solicita el envío del código de recuperación al correo
export async function forgotPassword(userEmail) {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_email: userEmail,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al solicitar la recuperación");
    }

    return response.json();
}

// Envía el correo junto con el código de 6 dígitos para verificarlo.
// Si es correcto, el backend devuelve un resetToken temporal.
export async function verifyResetCode({ userEmail, code }) {
    const response = await fetch(`${API_URL}/verify-code`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_email: userEmail,
            code,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "No se pudo verificar el código");
    }

    return response.json();
}

// Envía el resetToken (obtenido al verificar el código) junto con la nueva contraseña
export async function resetPassword({ resetToken, newPassword }) {
    const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            resetToken,
            newPassword,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al restablecer la contraseña");
    }

    return response.json();
}