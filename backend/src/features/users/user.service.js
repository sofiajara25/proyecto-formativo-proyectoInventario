// Importamos el repositorio de usuarios.
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { userRepository } from "./user.repository.js";

import bcrypt from "bcrypt";
import crypto from "crypto";

// Exportamos el servicio de usuarios.
// El service representa la capa de lógica de negocio de la aplicación.
export const userService = {
  async createUser(data) {
    // La contraseña ya no la escribe quien crea el usuario: se genera sola
    // (como pasaría con un id autoincremental) y queda hasheada en la base
    // de datos. Nadie, ni siquiera quien la creó, puede verla. Se ignora
    // cualquier "userPassword" que llegue del cliente, para que no quede
    // ninguna forma de fijarla a mano ni de conocer su valor en texto plano.
    const generatedPassword = crypto.randomBytes(24).toString("hex");
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const userData = {
      ...data,
      userPassword: hashedPassword,
    };

    return await userRepository.create(userData);
  },

  async getAllUsers() {
    return await userRepository.findAll();
  },

  async getUserById(id) {
    return await userRepository.findById(id);
  },

  async updateUser(id, userData) {
    const dataToUpdate = { ...userData };

    if (dataToUpdate.userPassword) {
      dataToUpdate.userPassword = await bcrypt.hash(dataToUpdate.userPassword, 10);
    } else {
      delete dataToUpdate.userPassword;
    }

    return await userRepository.update(id, dataToUpdate);
  },

  async getUsers() {
    return await userRepository.findAll();
  },

  // users.service.js
  async getPermissionsByUserId(userId) {
    return await userRepository.getPermissionsByUserId(userId);
  },

  async updatePermissions(userId, permissionIds) {
    return await userRepository.updatePermissions(userId, permissionIds);
  },

  async updateUserStatus(id, status) {
    return await userRepository.updateStatus(id, status);
  }


};




