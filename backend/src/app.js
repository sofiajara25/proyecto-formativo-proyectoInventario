// Importamos Express, el framework base para construir el servidor HTTP
import express from "express";
import fs from "fs";

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
import tasksRoutes from "./features/tasks/task.routes.js";
import permissionsRoutes from "./features/permissions/permissions.routes.js";
import accessRoutes from "./features/access/access.routes.js";
import inventoryNameRoutes from "./features/inventory-name/inventoryName.routes.js";
import categoryRoutes from "./features/categorys/category.routes.js"
import quotationRoutes from "./features/quotations/quotation.routes.js"
import loanSignatureRoutes from "./features/loan-signatures/loanSignature.routes.js"

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

app.use("/api/tasks", tasksRoutes);

app.use("/api/inventory-names", inventoryNameRoutes);

app.use("/api/categorys", categoryRoutes)

app.use("/api/quotations", quotationRoutes)

app.use("/api/loan-signatures", loanSignatureRoutes)

app.get("/uploads/:filename", (req, res, next) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(process.cwd(), "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return next();
  }

  const header = Buffer.alloc(12);
  const fd = fs.openSync(filePath, "r");
  const bytesRead = fs.readSync(fd, header, 0, header.length, 0);
  fs.closeSync(fd);

  const signature = header.subarray(0, bytesRead);
  const contentType = (() => {
    if (signature.subarray(0, 4).toString() === "%PDF") return "application/pdf";
    if (signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff) return "image/jpeg";
    if (signature.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
    if (signature.subarray(0, 4).toString() === "RIFF" && signature.subarray(8, 12).toString() === "WEBP") return "image/webp";
    return null;
  })();

  if (contentType) {
    res.setHeader("Content-Type", contentType);
  }
  res.setHeader("Content-Disposition", "inline");
  return res.sendFile(filePath);
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/permissions", permissionsRoutes);

app.use("/api/access", accessRoutes);

// Manejador de errores global.
// Sin esto, cualquier error que ocurra ANTES de llegar a un controller
// (ej. un middleware de multer que falla al procesar un archivo) es
// atrapado por el manejador por defecto de Express, que responde con una
// página HTML en vez de JSON — y eso rompe el "response.json()" del
// frontend con el error "Unexpected token '<' is not valid JSON".
// Este middleware debe ir SIEMPRE al final, después de todas las rutas.
app.use((err, req, res, next) => {
  console.error("ERROR NO CAPTURADO:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
  });
});

// Exportamos la aplicación configurada
// El arranque del servidor se hace en server.js
export default app;
