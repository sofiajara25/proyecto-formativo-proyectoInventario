// Importamos el servicio de usuarios.
// El controller NO implementa lógica de negocio,
// solo delega la operación al service correspondiente.
import { loanService } from "./loan.service.js";


// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)
export const loanController = {


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
      const loan = await loanService.createLoan({
        ...req.body,
        photo: photoPath,
      });


      // Respuesta HTTP en caso de éxito
      // 201: recurso creado correctamente según el estándar REST
      res.status(201).json({
        // Mensaje informativo para el cliente
        message: "Prestamo creado correctamente",


        // Retornamos únicamente el ID del usuario creado
        // Evita exponer información sensible innecesaria
        loanId: loan.id,
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
      const loans = await loanService.getAllLoans();
      res.status(200).json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const loan = await loanService.getLoanById(id);
      if (!loan) return res.status(404).json({ error: "Préstamo no encontrado" });
      res.status(200).json(loan);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const photoPath = req.file ? `uploads/${req.file.filename}` : null;
      const updatedLoan = await loanService.updateLoan(id, {
        ...req.body,
        photo: photoPath,
      });

      if (!updatedLoan) {
        return res.status(404).json({ error: "Préstamo no encontrado" });
      }

      res.status(200).json({
        message: "Préstamo actualizado correctamente",
        loan: updatedLoan,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
