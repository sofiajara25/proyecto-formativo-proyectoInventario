import { Router } from "express";
import { loanSignatureController } from "./loanSignature.controller.js";

const router = Router();

router.get("/:token", loanSignatureController.getByToken);
router.post("/:token/accept", loanSignatureController.accept);

export default router;
