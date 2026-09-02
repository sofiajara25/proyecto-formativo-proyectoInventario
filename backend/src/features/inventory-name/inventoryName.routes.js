import { Router } from "express";
import { inventoryNameController } from "./inventoryName.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = Router();

router.post("/", authenticateToken, requirePermission("create_inventory_name"), inventoryNameController.create);
router.get("/", authenticateToken, requirePermission("list_inventory_name"), inventoryNameController.list);
router.get("/:id", authenticateToken, requirePermission("view_inventory_name"), inventoryNameController.getById);
router.put("/:id", authenticateToken, requirePermission("modify_inventory_name"), inventoryNameController.update);
router.patch("/:id/status", authenticateToken, requirePermission("state_inventory_name"), inventoryNameController.updateStatus);

export default router;
