import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";

const API_URL = "http://localhost:5000/api/auth";
const SESSION_CHECK_INTERVAL_MS = 5000;

export default function App() {
  // Si el navegador restaura una página completa desde su caché de
  // atrás/adelante (bfcache) — por ejemplo al cerrar y volver a abrir la
  // pestaña — se fuerza una recarga para que ProtectedRoute/GuestRoute
  // vuelvan a evaluar si sigue habiendo una sesión válida, en vez de
  // quedarse con la vista ya renderizada de antes.
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // Mientras haya un token guardado, se pregunta cada pocos segundos si
  // la sesión sigue siendo la activa. Si en otra pestaña/navegador se
  // forzó el cierre de esta sesión, esta consulta empieza a responder 401
  // casi de inmediato, y el interceptor global (authFetchGuard.js) saca a
  // la persona sin que tenga que hacer nada más.
  useEffect(() => {
    const interval = setInterval(() => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      fetch(`${API_URL}/session`, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch((err) => {
        console.error("Error revisando la sesión:", err);
      });
    }, SESSION_CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return <RouterProvider router={router} />;
}