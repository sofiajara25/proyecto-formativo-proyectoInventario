// Importamos Express, el framework base para construir el servidor HTTP
import express from "express";

import path from "path";

// Importamos el middleware CORS
// Permite controlar qué orígenes pueden comunicarse con el backend
import cors from "cors";

// Importamos las rutas del feature users
// Cada feature expone su propio router independiente
import userRoutes from "./features/users/user.routes.js";
import authRoutes from "./features/auth/auth.routes.js";
import consumibleMaterialRoutes from "./features/consumable-material/consumableMaterial.routes.js";
import returnableMaterialRoutes from "./features/returnable-material/returnableMaterial.routes.js";
import brandRoutes from "./features/brands/brand.routes.js";
import loanRoutes from "./features/loans/loan.routes.js";
import returnsRoutes from "./features/returns/returns.routes.js"
import groupsRoutes from "./features/groups/groups.routes.js";


// Creamos la instancia principal de la aplicación Express
const app = express();


// Middleware de CORS
// Permite solicitudes únicamente desde el frontend en localhost:5173
// (típico proyecto Vite en desarrollo)
app.use(cors({ origin: "http://localhost:5173" }));


// Middleware para parsear cuerpos de petición en formato JSON
// Sin este middleware, req.body sería undefined
app.use(express.json());


// Registro del router de usuarios
// Todas las rutas del feature users quedarán bajo el prefijo /api/users
// Ejemplo final: POST http://localhost:4000/api/users
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/consumableMaterial", consumibleMaterialRoutes);
app.use("/api/returnableMaterial", returnableMaterialRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/returns", returnsRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Exportamos la aplicación configurada
// El arranque del servidor se hace en server.js
export default app;
