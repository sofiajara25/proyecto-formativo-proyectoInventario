// Importamos el repositorio de usuarios.
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { loanRepository } from "./loan.repository.js";

import bcrypt from "bcrypt";

// Exportamos el servicio de usuarios.
// El service representa la capa de lógica de negocio de la aplicación.
export const loanService = {
    // Crear un préstamo
    async createLoan(data) {

        const loanData = {
            ...data,
            loanCategory: data.loanCategory?.toLowerCase(),
        };

        console.log("SERVICE DATA:", loanData);

        // Delegamos al repository
        return await loanRepository.create(loanData);
    },

    async getAllLoans() {
        return await loanRepository.findAll();
    },
    async getLoanById(id) {
        return await loanRepository.findById(id);
    },
    async updateLoan(id, data) {
        return await loanRepository.update(id, data);
    }
};
