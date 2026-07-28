// Importamos el servicio de usuarios.
// El controller NO implementa lógica de negocio,
// solo delega la operación al service correspondiente.
import { returnService } from "./returns.service.js";


// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)
export const returnController = {


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
      const returns = await returnService.createReturn(req.body);


      // Respuesta HTTP en caso de éxito
      // 201: recurso creado correctamente según el estándar REST
      res.status(201).json({
        // Mensaje informativo para el cliente
        message: "Retorno creado correctamente",


        // Retornamos únicamente el ID del usuario creado
        // Evita exponer información sensible innecesaria
        returnId: returns.id,
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
      const returns = await returnService.getAllReturn();
      res.status(200).json(returns);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const returns = await returnService.getReturnById(id);
      if (!returns) return res.status(404).json({ error: "Retorno de material no encontrado" });
      res.status(200).json(returns);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await returnService.updateReturn(id, req.body);
      if (!updated) return res.status(404).json({ error: "Retorno no encontrado" });
      res.status(200).json({ message: "Retorno actualizado correctamente", retorno: updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { isAvailable } = req.body;
      const updated = await returnService.updateReturnStatus(id, isAvailable);
      if (!updated) return res.status(404).json({ error: "Retorno no encontrado" });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
