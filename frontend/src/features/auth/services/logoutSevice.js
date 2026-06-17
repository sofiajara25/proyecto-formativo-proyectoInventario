// Cerrar sesion eliminado JWT

export function logout() {
    sessionStorage.removeItem("token");
}