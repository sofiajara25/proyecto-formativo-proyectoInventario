import { Router } from "express";
import { permissionsController } from "./permissions.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requireSuperAdmin } from "../../middlewares/permission.middleware.js";

const router = Router();

// El catálogo completo de permisos solo se usa en Grupos y Permisos,
// para armar la lista de checkboxes: exclusivo del Super Administrador.
router.get("/", authenticateToken, requireSuperAdmin(), permissionsController.getAll);

export default router;