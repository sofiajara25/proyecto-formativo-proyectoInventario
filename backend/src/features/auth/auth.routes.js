// bankend/scr/features/auth/auth.routes.js
// Rutas de autenticacion

import { Router } from "express";
import { authController } from "./auth.controller.js";

const router = Router();

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/forgot-password
// Paso 1: envía el código de 6 dígitos al correo
router.post("/forgot-password", authController.forgotPassword);

// POST /api/auth/verify-code
// Paso 2: valida el código y entrega el resetToken
router.post("/verify-code", authController.verifyCode);

// POST /api/auth/reset-password
// Paso 3: define la nueva contraseña usando el resetToken
router.post("/reset-password", authController.resetPassword);

export default router;