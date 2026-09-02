// Importamos Router desde Express.
// Router permite modularizar las rutas por feature
// y mantener el archivo principal de la app limpio.
import { Router } from "express";


// Importamos el controlador de usuarios.
// El router nunca implementa lógica,
// solo delega la ejecución al controller.
import { brandController } from "./brand.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";


// Creamos una instancia del router de Express
const router = Router();


// Definimos la ruta para crear un usuario
// POST /users
// Cuando se recibe una petición POST en la raíz del recurso,
// Express ejecuta el método create del controller.
router.post("/", authenticateToken, requirePermission("create_brand"), brandController.create);

// (había una ruta GET "/" duplicada apuntando a brandController.getAll;
// Express solo ejecutaba la primera, así que la segunda no hacía nada.
// Se deja una sola.)
router.get("/", authenticateToken, requirePermission("list_brand"), brandController.list);

// routes/brand.routes.js
router.get("/:id", authenticateToken, requirePermission("view_brand"), brandController.getById);

router.put("/:id", authenticateToken, requirePermission("modify_brand"), brandController.update);

router.patch("/:id/status", authenticateToken, requirePermission("state_brand"), brandController.updateStatus);

// Exportamos el router para ser registrado en la aplicación principal
// (ej: app.use("/users", router))
export default router;
