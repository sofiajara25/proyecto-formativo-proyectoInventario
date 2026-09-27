import { Router } from "express";
import { activityLogController } from "./activityLog.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = Router();

// Ver la bitácora de actividad es un permiso otorgable normal
// ("list_activity_log"), como cualquier otro módulo: se puede asignar
// desde Grupos y Permisos a un grupo o a un usuario puntual. El Super
// Administrador siempre puede verla igual, porque requirePermission()
// lo deja pasar de todas formas sin importar sus permisos asignados.
router.get("/", authenticateToken, requirePermission("list_activity_log"), activityLogController.list);

export default router;
