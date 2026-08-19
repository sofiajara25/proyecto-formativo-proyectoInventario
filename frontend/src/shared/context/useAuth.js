// Hook para consumir el contexto de autenticación desde cualquier componente:
// const { isAuthenticated, login, logout } = useAuth();
import { useContext } from "react";
import { AuthContext } from "./authContext";

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    }

    return context;
}
