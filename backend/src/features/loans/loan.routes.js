// Importamos Router desde Express.
// Router permite modularizar las rutas por feature
// y mantener el archivo principal de la app limpio.
import { Router } from "express";
import multer from "multer";
import path from "path";


// Importamos el controlador de usuarios.
// El router nunca implementa lógica,
// solo delega la ejecución al controller.
import { loanController } from "./loan.controller.js";


// Creamos una instancia del router de Express
const router = Router();

// IMPORTANTE: diskStorage con filename que conserva la extensión (igual que
// materiales). Con multer({dest:"uploads/"}) el archivo se guarda con un
// nombre hash SIN extensión y el frontend no puede saber si es imagen o PDF
// solo mirando el nombre.
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
// upload.fields (en vez de .array/.single) para poder aceptar varias fotos
// tanto al crear como al actualizar, de forma consistente.
router.post("/", upload.fields([{ name: "photo", maxCount: 12 }]), loanController.create);
router.get("/", loanController.list);
router.get("/:loan_id", loanController.getById);
router.put("/:loan_id", upload.fields([{ name: "photo", maxCount: 12 }]), loanController.update);
router.put("/:loan_id/status", loanController.updateStatus);
// Exportamos el router para ser registrado en la aplicación principal
// (ej: app.use("/users", router))
export default router;
