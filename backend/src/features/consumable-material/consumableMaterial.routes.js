// Importamos Router desde Express.
// Router permite modularizar las rutas por feature
// y mantener el archivo principal de la app limpio.
import { Router } from "express";
import multer from "multer";
import path from "path";

// Importamos el controlador de usuarios.
// El router nunca implementa lógica,
// solo delega la ejecución al controller.
import { consumableMaterialController } from "./consumableMaterial.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";


// Creamos una instancia del router de Express
const router = Router();
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
    requirePermission("create_consumable_material"),
    upload.fields([
        { name: "photo", maxCount: 12 },
        { name: "materialTechnicalSheet", maxCount: 1 }
    ]),
    consumableMaterialController.create);

router.get(
    "/",
    authenticateToken,
    requirePermission("list_consumable_material"),
    consumableMaterialController.list);

// Debe ir ANTES de "/:id" — si no, Express interpreta "next-tool-id"
// como si fuera el parámetro :id.
router.get(
    "/next-tool-id",
    authenticateToken,
    requirePermission("create_consumable_material"),
    consumableMaterialController.getNextToolId);

router.get(
    "/:id",
    authenticateToken,
    requirePermission("view_consumable_material"),
    consumableMaterialController.getById);

router.put(
    "/:id",
    authenticateToken,
    requirePermission("modify_consumable_material"),
    upload.fields([
        { name: "photo", maxCount: 12 },
        { name: "materialTechnicalSheet", maxCount: 1 }
    ]),
    consumableMaterialController.update);

router.patch(
    "/:id/status",
    authenticateToken,
    requirePermission("state_consumable_material"),
    consumableMaterialController.updateStatus);

// Exportamos el router para ser registrado en la aplicación principal
// (ej: app.use("/users", router))
export default router;
