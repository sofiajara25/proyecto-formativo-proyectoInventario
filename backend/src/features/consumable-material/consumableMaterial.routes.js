// Importamos Router desde Express.
// Router permite modularizar las rutas por feature
// y mantener el archivo principal de la app limpio.
import { Router } from "express";
import multer from "multer";

// Importamos el controlador de usuarios.
// El router nunca implementa lógica,
// solo delega la ejecución al controller.
import { consumableMaterialController } from "./consumableMaterial.controller.js";


// Creamos una instancia del router de Express
const router = Router();
const upload = multer({ dest: "uploads/" });// o config mas avanzada 

// Definimos la ruta para crear un usuario
// POST /users
// Cuando se recibe una petición POST en la raíz del recurso,
// Express ejecuta el método create del controller.
router.post("/", upload.array("photo"), consumableMaterialController.create);

router.get("/", consumableMaterialController.list);

router.get("/:id", consumableMaterialController.getById);

router.put("/:id", upload.single("photo"), consumableMaterialController.update);

router.patch("/:id/status", consumableMaterialController.updateStatus);

// Exportamos el router para ser registrado en la aplicación principal
// (ej: app.use("/users", router))
export default router;
