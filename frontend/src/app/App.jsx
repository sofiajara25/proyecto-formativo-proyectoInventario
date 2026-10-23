import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import AlertProvider from "../shared/context/AlertProvider";
import SessionModalProvider from "../shared/context/SessionModalProvider";
import useIdleTimer from "../shared/hooks/useIdleTimer";
import { getMyAccess } from "../features/access/services/accessService";
import { saveAccess } from "../shared/utils/permissions";

const API_URL = "/api/auth";
const SESSION_CHECK_INTERVAL_MS = 5000;

export default function App() {
  // Cierra la sesión (con aviso, ver SessionModalProvider) si la persona
  // no interactúa con el sistema por un buen rato.
  useIdleTimer();

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

  // Los permisos se leen del backend al iniciar sesión, pero un
  // administrador puede cambiarlos mientras la persona tiene la sesión
  // abierta. Para no seguir mostrando botones con permisos viejos, se
  // vuelven a pedir al abrir la app y cada vez que se regresa a la pestaña.
  useEffect(() => {
    const refreshAccess = () => {
      if (!sessionStorage.getItem("token")) return;
      getMyAccess()
        .then(saveAccess)
        .catch((err) => console.error("Error actualizando los permisos:", err));
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshAccess();
    };

    refreshAccess();
    window.addEventListener("focus", refreshAccess);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", refreshAccess);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <AlertProvider>
      <SessionModalProvider>
        <RouterProvider router={router} />
      </SessionModalProvider>
    </AlertProvider>
  );
}