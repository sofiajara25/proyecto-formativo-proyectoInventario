import { Router } from "express";
import { inventoryNameController } from "./inventoryName.controller.js";

const router = Router();

router.post("/", inventoryNameController.create);
router.get("/", inventoryNameController.list);
router.get("/:id", inventoryNameController.getById);
router.put("/:id", inventoryNameController.update);
router.patch("/:id/status", inventoryNameController.updateStatus);

export default router;
