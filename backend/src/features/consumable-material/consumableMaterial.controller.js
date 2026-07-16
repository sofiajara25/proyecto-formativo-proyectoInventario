// Importamos el servicio de usuarios.
// El controller NO implementa lógica de negocio,
// solo delega la operación al service correspondiente.
import { consumableMaterialService } from "./consumableMaterial.service.js";


// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)
export const consumableMaterialController = {


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
      const photoPath = req.files?.[0] ? `uploads/${req.files[0].filename}` : null;
      // pasamos todos los datos al service
      const consumable = await consumableMaterialService.createConsumableMaterial({
        ...req.body,
        photo: photoPath,
      });

      // Respuesta HTTP en caso de éxito
      // 201: recurso creado correctamente según el estándar REST
      res.status(201).json({
        // Mensaje informativo para el cliente
        message: "Material de consumo creado correctamente",


        // Retornamos únicamente el ID del usuario creado
        // Evita exponer información sensible innecesaria
        consumableMaterialId: consumable.id,
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

  async list(req, res) {
    try {
      const consumables = await consumableMaterialService.getAllConsumables();
      res.status(200).json(consumables);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const consumable = await consumableMaterialService.getConsumableById(id);
      if (!consumable) return res.status(404).json({ error: "Material de consumo no encontrado" });
      res.status(200).json(consumable);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      // ruta de la nueva foto si se subió
      const photoPath = req.file ? `uploads/${req.file.filename}` : null;

      const updatedConsumable = await consumableMaterialService.updateConsumable(id, {
        ...req.body,
        photo: photoPath,
      });

      if (!updatedConsumable) return res.status(404).json({ error: "Material de consumo no encontrado" });
      res.status(200).json({ message: "Material actualizado correctamente", updatedConsumable });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }



};
