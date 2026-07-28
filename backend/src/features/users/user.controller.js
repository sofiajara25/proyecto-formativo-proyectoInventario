// Importamos el servicio de usuarios.
// El controller NO implementa lógica de negocio,
// solo delega la operación al service correspondiente.
import { userService } from "./user.service.js";


// Exportamos un objeto controlador.
// Agrupar handlers en un objeto permite escalabilidad
// (create, update, delete, getById, etc.)
export const userController = {


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
      // ruta del archivo subido
      const photoPath = req.files?.[0] ? `uploads/${req.files[0].filename}` : null;
      // pasamos todos los datos al service
      const user = await userService.createUser({
        ...req.body,
        userPhoto: photoPath,
      });


      // Respuesta HTTP en caso de éxito
      // 201: recurso creado correctamente según el estándar REST
      res.status(201).json({
        // Mensaje informativo para el cliente
        message: "Usuario creado correctamente",


        // Retornamos únicamente el ID del usuario creado
        // Evita exponer información sensible innecesaria
        id: user.id,
        userId: user.id,
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
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      console.error("ERROR BACKEND:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error("ERROR BACKEND:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      // ruta de la nueva foto si se subió
      const photoPath = req.file ? `uploads/${req.file.filename}` : null;

      const updatedUser = await userService.updateUser(id, {
        ...req.body,
        userPhoto: photoPath,
      });

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getPermissionsByUserId(req, res) {
    try {
      const userId = Number(req.params.userId);

      const permissions = await userService.getPermissionsByUserId(userId);

      res.json(permissions);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Error obteniendo permisos del usuario",
      });
    }
  },

  async updatePermissions(req, res) {
    try {
      const userId = Number(req.params.userId);
      const { permissionIds } = req.body;

      await userService.updatePermissions(userId, permissionIds);

      res.status(200).json({
        message: "Permisos actualizados correctamente",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Error actualizando permisos del usuario",
      });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { userStatus } = req.body;
      const updated = await userService.updateUserStatus(id, userStatus);
      if (!updated) return res.status(404).json({ error: "Usuario no encontrado" });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};

