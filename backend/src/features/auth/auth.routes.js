// bankend/scr/features/auth/auth.routes.js
// Rutas de autenticacion

import { Router } from "express";
import { authController } from "./auth.controller.js";

const router = Router();

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/forgot-password
router.post("/forgot-password", authController.forgotPassword);

// POST /api/auth/verify-code
router.post("/verify-code", authController.verifyCode);

// POST /api/auth/reset-password
router.post("/reset-password", authController.resetPassword);

export default router;