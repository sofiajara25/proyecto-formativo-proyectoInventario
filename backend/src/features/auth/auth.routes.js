// bankend/scr/features/auth/auth.routes.js
// Rutas de autenticacion

import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

const router = Router();

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/logout
// Limpia la sesión activa guardada en el usuario, para que pueda volver a
// iniciar sesión en otra pestaña/navegador sin tener que forzarlo.
router.post("/logout", authenticateToken, authController.logout);

// GET /api/auth/session
// Endpoint liviano que el frontend consulta cada pocos segundos: no hace
// nada por sí mismo, solo se apoya en que authenticateToken ya revisa que
// el token siga siendo el de la sesión activa. Si en otro lado forzaron
// el cierre de esta sesión, esto empieza a responder 401 casi de
// inmediato, y el interceptor global del frontend saca a la persona sin
// que tenga que interactuar con nada.
router.get("/session", authenticateToken, authController.checkSession);

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