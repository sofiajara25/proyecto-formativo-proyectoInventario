import { Router } from "express";
import { groupsController } from "./groups.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requireSuperAdmin } from "../../middlewares/permission.middleware.js";

const router = Router();

// groups.routes.js
//
// GET / se deja solo con authenticateToken (sin requireSuperAdmin):
// lo usa cualquiera con permiso de crear/editar usuarios para llenar el
// selector de "Grupo" en el formulario de usuarios, no solo Grupos y
// Permisos. Crear grupos y ver/editar los permisos de un grupo sí es
// exclusivo del Super Administrador.
router.post("/", authenticateToken, requireSuperAdmin(), groupsController.createGroup);

router.get("/", authenticateToken, groupsController.getAll);

router.get(
    "/:groupId/permissions",
    authenticateToken,
    requireSuperAdmin(),
    groupsController.getPermissionsByGroupId,
);

router.put(
    "/:groupId/permissions",
    authenticateToken,
    requireSuperAdmin(),
    groupsController.updatePermissions,
);

export default router;