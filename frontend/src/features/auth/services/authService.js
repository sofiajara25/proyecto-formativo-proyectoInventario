// Consumir Api login

const API_URL = "http://localhost:5000/api/auth";

export async function login(userData, { force = false } = {}) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            user_email: userData.userEmail,
            password: userData.userPassword,
            force,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        const error = new Error(errorBody.error || "Error login");
        // Código especial cuando el rechazo es por sesión activa en otro
        // lado (ver auth.controller.js -> ACTIVE_SESSION), para que el
        // formulario pueda ofrecer el botón de "forzar cierre" en vez de
        // mostrarlo como un error de credenciales cualquiera.
        error.code = errorBody.code;
        throw error;
    }

    return response.json();
}

// Devuelve los datos del usuario que hizo login (id, email), leyéndolos
// directamente del token JWT guardado en sessionStorage. No hace falta
// llamar al backend: el token ya trae esos datos en su payload (ver
// auth.service.js -> jwt.sign({ id: user.id, email: user.user_email }, ...)).
// Devuelve null si no hay sesión o el token no se puede leer.
export function getCurrentUser() {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
        const payloadBase64 = token.split(".")[1];
        // El payload de un JWT viene en base64url: hay que pasarlo a base64
        // normal antes de poder usar atob().
        const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
                .join("")
        );
        return JSON.parse(json); // { id, email, iat, exp }
    } catch (err) {
        console.error("Error leyendo el usuario desde el token:", err);
        return null;
    }
}