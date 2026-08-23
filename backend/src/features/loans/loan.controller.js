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
      // "materials" llega como un string JSON dentro del multipart/form-data
      // (FormData no soporta arreglos anidados), así que hay que parsearlo
      // antes de pasarlo al service.
      let materials = [];
      try {
        materials = JSON.parse(req.body.materials ?? "[]");
      } catch {
        return res.status(400).json({ error: "El formato de materials no es válido" });
      }

      // Llamamos al servicio de usuario, pasando los datos recibidos
      // Aquí ocurre la lógica real de negocio (validaciones, persistencia, etc.)
      // Un préstamo puede tener varias fotos: tomamos TODAS las que
      // llegaron en el campo "photo" (no solo la primera).
      const photos = (req.files?.photo ?? []).map((f) => `uploads/${f.filename}`);

      // FormData manda todo como texto: "isActive" llega como "true"/"false".
      // Si no viaja (nunca debería, pero por si acaso), el préstamo nace activo.
      const isActive = req.body.isActive === undefined ? true : req.body.isActive === "true";

      const loan = await loanService.createLoan({
        ...req.body,
        materials,
        photos,
        isActive,
      });


      // Respuesta HTTP en caso de éxito
      // 201: recurso creado correctamente según el estándar REST
      res.status(201).json({
        // Mensaje informativo para el cliente
        message: "Prestamo creado correctamente",


        // Retornamos únicamente el ID del préstamo creado
        // Evita exponer información sensible innecesaria
        loanId: loan.loan_id,
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
      console.error("ERROR BACKEND:", err);
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { loan_id } = req.params;
      const loan = await loanService.getLoanById(loan_id);
      if (!loan) {
        return res.status(404).json({ error: "Préstamo no encontrado" });
      }
      res.status(200).json(loan);
    } catch (err) {
      console.error("ERROR BACKEND:", err);
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { loan_id } = req.params;

      // Fotos nuevas que se acaban de subir en este submit.
      const newPhotos = (req.files?.photo ?? []).map((f) => `uploads/${f.filename}`);

      // "keepPhotos" trae, en JSON, las rutas de las fotos que YA existían
      // y el usuario decidió conservar (no les dio a la ❌).
      let keepPhotos = [];
      try {
        keepPhotos = JSON.parse(req.body.keepPhotos ?? "[]");
      } catch {
        keepPhotos = [];
      }
      if (!Array.isArray(keepPhotos)) keepPhotos = [];

      // "materials" también llega como JSON dentro del multipart/form-data.
      let materials;
      if (req.body.materials !== undefined) {
        try {
          materials = JSON.parse(req.body.materials);
        } catch {
          return res.status(400).json({ error: "El formato de materials no es válido" });
        }
      }

      const photos = [...keepPhotos, ...newPhotos];

      // FormData manda todo como texto: "isActive" llega como "true"/"false".
      const isActive = req.body.isActive === undefined ? undefined : req.body.isActive === "true";

      const updatedLoan = await loanService.updateLoan(loan_id, {
        ...req.body,
        materials,
        photos,
        isActive,
      });
      res.status(200).json({
        message: "Préstamo actualizado correctamente",
        loan: updatedLoan,
      });
    } catch (err) {
      console.error("ERROR BACKEND:", err);
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const { loan_id } = req.params;
      const { is_active } = req.body;
      const updatedLoan = await loanService.updateLoanStatus(loan_id, is_active);
      res.status(200).json({
        message: "Estado del préstamo actualizado correctamente",
        loan: updatedLoan,
      });
    } catch (err) {
      console.error("ERROR BACKEND:", err);
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }


};