// Importamos Router desde Express.
// Router permite modularizar las rutas por feature
// y mantener el archivo principal de la app limpio.
import { Router } from "express";
import multer from "multer";
import path from "path";

// Importamos el controlador de usuarios.
// El router nunca implementa lógica,
// solo delega la ejecución al controller.
import { userController } from "./user.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

// Creamos una instancia del router de Express
const router = Router();

// IMPORTANTE: usamos diskStorage con un filename que conserva la extensión
// (igual que en materiales/préstamos). Con multer({dest:"uploads/"}) el
// archivo se guarda con un nombre hash SIN extensión, y el frontend no
// puede saber si es una imagen o un PDF solo mirando el nombre — por eso
// las fotos de usuario se veían como "PDF" en vez de mostrar la imagen.
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
        const extensionByType = {
            "application/pdf": ".pdf",
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
        };
        const extension = path.extname(file.originalname) || extensionByType[file.mimetype] || "";
        const safeFieldName = file.fieldname.replace(/[^a-zA-Z0-9]/g, "");
        const uniqueName = `${safeFieldName}-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

        cb(null, uniqueName);
    },
});
const upload = multer({ storage });


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
