import { Router } from "express";
import { groupsController } from "./groups.controller.js";

const router = Router();

router.get("/", groupsController.getAll);

router.post("/", groupsController.create);

router.get("/:groupId/permissions", groupsController.getPermissionsByGroupId);

export default router;
