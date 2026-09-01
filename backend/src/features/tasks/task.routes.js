// Importamos Router desde Express.
// Router permite modularizar las rutas por feature
// y mantener el archivo principal de la app limpio.
import { Router } from "express";
import multer from "multer";
import path from "path";


// Importamos el controlador de usuarios.
// El router nunca implementa lógica,
// solo delega la ejecución al controller.
import { taskController } from "./task.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";


// Creamos una instancia del router de Express
const router = Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
        const extensionByType = {
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
// authenticateToken: necesitamos saber quién crea la tarea (req.user.id)
// para registrarla como "created_by" y luego poder avisarle cuando le
// suban la evidencia.
router.post("/", authenticateToken, taskController.create);

router.get("/user/:userId", taskController.getByUserId);

router.get("/", taskController.getByUser);

router.get("/all", taskController.getAll);

// Debe ir ANTES de "/:id" — si no, Express interpreta "pending-confirmation"
// como si fuera el parámetro :id.
router.get("/pending-confirmation/mine", authenticateToken, taskController.getPendingConfirmation);

// authenticateToken: si la tarea todavía no tiene dueño (tareas viejas,
// creadas antes de que existiera "created_by"), se le asigna quien la
// esté editando en ese momento.
router.put("/:id", authenticateToken, taskController.update);

router.post(
    "/:id/evidence",
    authenticateToken,
    upload.single("evidencePhoto"),
    taskController.submitEvidence
);

router.patch("/:id/confirm", authenticateToken, taskController.confirm);

// Exportamos el router para ser registrado en la aplicación principal
// (ej: app.use("/users", router))
export default router;
