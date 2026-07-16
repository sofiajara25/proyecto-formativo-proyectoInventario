import { Router } from "express";
import { groupsController } from "./groups.controller.js";

const router = Router();

// groups.routes.js
router.post("/", groupsController.createGroup);

router.get("/", groupsController.getAll);

router.get("/:groupId/permissions", groupsController.getPermissionsByGroupId);

router.put("/:groupId/permissions", groupsController.updatePermissions);

export default router;