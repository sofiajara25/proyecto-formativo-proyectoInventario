// El objeto Context en sí, separado del Provider y del hook.
// Así cada archivo exporta una sola cosa y React Fast Refresh
// (recarga en caliente durante desarrollo) funciona sin advertencias.
import { createContext } from "react";

export const AuthContext = createContext(null);
