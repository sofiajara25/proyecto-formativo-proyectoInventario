// Importamos Router desde Express.
// Router permite modularizar las rutas por feature
// y mantener el archivo principal de la app limpio.
import { Router } from "express";


// Importamos el controlador de usuarios.
// El router nunca implementa lógica,
// solo delega la ejecución al controller.
import { categoryController } from "./category.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";


// Creamos una instancia del router de Express
const router = Router();


// Definimos la ruta para crear un usuario
// POST /users
// Cuando se recibe una petición POST en la raíz del recurso,
// Express ejecuta el método create del controller.
router.post("/", authenticateToken, requirePermission("create_category"), categoryController.create);

// (había una ruta GET "/" duplicada; Express solo ejecutaba la primera)
router.get("/", authenticateToken, requirePermission("list_category"), categoryController.list);

// routes/brand.routes.js
router.get("/:id", authenticateToken, requirePermission("view_category"), categoryController.getById);

router.put("/:id", authenticateToken, requirePermission("modify_category"), categoryController.update);

router.patch("/:id/status", authenticateToken, requirePermission("state_category"), categoryController.updateStatus);

// Exportamos el router para ser registrado en la aplicación principal
// (ej: app.use("/users", router))
export default router;
