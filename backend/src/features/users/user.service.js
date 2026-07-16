// Importamos el repositorio de usuarios.
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { userRepository } from "./user.repository.js";

import bcrypt from "bcrypt";

// Exportamos el servicio de usuarios.
// El service representa la capa de lógica de negocio de la aplicación.
export const userService = {
  async createUser(data) {
    if (!data.userPassword) {
      throw new Error("El campo userPassword es obligatorio");
    }

    const hashedPassword = await bcrypt.hash(data.userPassword, 10);

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
  }


};




