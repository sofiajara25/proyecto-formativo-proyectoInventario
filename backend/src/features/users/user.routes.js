// Importamos Router desde Express.
// Router permite modularizar las rutas por feature
// y mantener el archivo principal de la app limpio.
import { Router } from "express";
import multer from "multer";

// Importamos el controlador de usuarios.
// El router nunca implementa lógica,
// solo delega la ejecución al controller.
import { userController } from "./user.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

// Creamos una instancia del router de Express
const router = Router();
const upload = multer({ dest: "uploads/" });// o config mas avanzada 


// Definimos la ruta para crear un usuario
// POST /users
// Cuando se recibe una petición POST en la raíz del recurso,
// Express ejecuta el método create del controller.
router.post(
    "/",
    authenticateToken,
    upload.array("userPhoto"),
    userController.create);

// Obtener todos los usuarios
router.get(
    "/",
    authenticateToken,
    userController.list
);

// Obtener un usuario por ID
router.get(
    "/:id",
    authenticateToken,
    userController.getById
);


router.put(
    "/:id",
    authenticateToken,
    upload.single("userPhoto"),
    userController.update
);

router.get("/:userId/permissions", userController.getPermissionsByUserId);
router.put("/:userId/permissions", userController.updatePermissions);
router.patch("/:id/status", authenticateToken, userController.updateStatus);

// Exportamos el router para ser registrado en la aplicación principal
// (ej: app.use("/users", router))
export default router;
