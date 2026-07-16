import { Router } from "express";
import { permissionsController } from "./permissions.controller.js";

const router = Router();

router.get("/", permissionsController.getAll);

export default router;