// Importamos Router desde Express.
// Router permite modularizar las rutas por feature
// y mantener el archivo principal de la app limpio.
import { Router } from "express";


// Importamos el controlador de usuarios.
// El router nunca implementa lógica,
// solo delega la ejecución al controller.
import { taskController } from "./task.controller.js";


// Creamos una instancia del router de Express
const router = Router();


// Definimos la ruta para crear un usuario
// POST /users
// Cuando se recibe una petición POST en la raíz del recurso,
// Express ejecuta el método create del controller.
router.post("/", taskController.create);

router.get("/user/:userId", taskController.getByUserId);

router.get("/", taskController.getByUser);

router.get("/all", taskController.getAll);

router.put("/:id", taskController.update);

// Exportamos el router para ser registrado en la aplicación principal
// (ej: app.use("/users", router))
export default router;
