import { Router } from "express";
import { inventoryNameController } from "./inventoryName.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission, requireAnyPermission, MATERIAL_FORM_PERMISSIONS } from "../../middlewares/permission.middleware.js";

const router = Router();

router.post("/", authenticateToken, requirePermission("create_inventory_name"), inventoryNameController.create);
// Listado: también lo necesitan los selects de los formularios de
// material, así que basta con poder listar este catálogo O con poder
// crear/editar materiales.
router.get("/", authenticateToken, requireAnyPermission(["list_inventory_name", ...MATERIAL_FORM_PERMISSIONS]), inventoryNameController.list);
router.get("/:id", authenticateToken, requirePermission("view_inventory_name"), inventoryNameController.getById);
router.put("/:id", authenticateToken, requirePermission("modify_inventory_name"), inventoryNameController.update);
router.patch("/:id/status", authenticateToken, requirePermission("state_inventory_name"), inventoryNameController.updateStatus);

export default router;
