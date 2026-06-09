// Importamos el servicio de usuarios.
// El controller NO implementa lógica de negocio,
// solo delega la operación al service correspondiente.
import { returnableMaterialService } from "./returnableMaterial.service.js";


// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)
export const returnableMaterialController = {


    // Método encargado de manejar la creación de un usuario
    // Se asume que este método será usado como handler de una ruta Express
    async create(req, res) {


        // Log del cuerpo de la petición
        // Útil en desarrollo para validar que el frontend envía correctamente los datos
        // En producción suele reemplazarse por logging estructurado o eliminarse
        console.log("BODY RECIBIDO:", req.body); // CLAVE


        try {
            // Llamamos al servicio de usuario, pasando los datos recibidos
            // Aquí ocurre la lógica real de negocio (validaciones, persistencia, etc.)
            const returnableMaterial = await returnableMaterialService.createReturnableMaterial(req.body);


            // Respuesta HTTP en caso de éxito
            // 201: recurso creado correctamente según el estándar REST
            res.status(201).json({
                // Mensaje informativo para el cliente
                message: "Material devolutivo creado correctamente",


                // Retornamos únicamente el ID del usuario creado
                // Evita exponer información sensible innecesaria
                returnableMaterialId: returnableMaterial.id,
            });


        } catch (err) {
            // Capturamos cualquier error lanzado por el service o capas inferiores
            // Se registra el error completo para depuración en backend
            console.error("ERROR BACKEND:", err);


            // Respuesta HTTP de error genérico
            // 500: error interno del servidor
            res.status(500).json({
                // Se envía el mensaje del error para diagnóstico
                // En producción suele mapearse a mensajes controlados
                error: err.message,
            });
        }
    },
};
