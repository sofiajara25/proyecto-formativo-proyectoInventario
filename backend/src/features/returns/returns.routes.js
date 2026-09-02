// Importamos Router desde Express.
// Router permite modularizar las rutas por feature
// y mantener el archivo principal de la app limpio.
import { Router } from "express";


// Importamos el controlador de usuarios.
// El router nunca implementa lógica,
// solo delega la ejecución al controller.
import { returnController } from "./returns.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";


// Creamos una instancia del router de Express
const router = Router();


// Definimos la ruta para crear un usuario
// POST /users
// Cuando se recibe una petición POST en la raíz del recurso,
// Express ejecuta el método create del controller.
router.post("/", authenticateToken, requirePermission("create_return"), returnController.create);

router.get("/", authenticateToken, requirePermission("list_return"), returnController.list);

router.get("/:id", authenticateToken, requirePermission("view_return"), returnController.getById);

router.put("/:id", authenticateToken, requirePermission("modify_return"), returnController.update);

router.patch("/:id/status", authenticateToken, requirePermission("state_return"), returnController.updateStatus);

// Exportamos el router para ser registrado en la aplicación principal
// (ej: app.use("/users", router))
export default router;
