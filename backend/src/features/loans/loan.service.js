// Importamos el repositorio de préstamos.
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { loanRepository } from "./loan.repository.js";
import { pool } from "../../config/db.js";

// Exportamos el servicio de préstamos.
// El service representa la capa de lógica de negocio de la aplicación.
export const loanService = {
    // Crear un préstamo con uno o más materiales.
    async createLoan(data) {

        // "materials" llega como arreglo de { loanCategory, loanProductName, loanQuantity }.
        // Normalizamos la categoría de cada material a minúsculas, igual que
        // se hacía antes con el único material del préstamo.
        const materials = (data.materials ?? []).map((material) => ({
            ...material,
            loanCategory: material.loanCategory?.toLowerCase(),
            loanQuantity: Number(material.loanQuantity),
        }));

        if (materials.length === 0) {
            throw new Error("Debe agregar al menos un material al préstamo");
        }

        const loanData = {
            ...data,
            materials,
        };

        console.log("SERVICE DATA:", loanData);

        // Delegamos al repository
        return await loanRepository.create(loanData);
    },

    async getAllLoans() {
        return await loanRepository.findAll();
    },
    async getLoanById(loan_id) {
        return await loanRepository.findById(loan_id);
    },
    async updateLoan(loan_id, data) {
        const materials = Array.isArray(data.materials)
            ? data.materials.map((material) => ({
                ...material,
                loanCategory: material.loanCategory?.toLowerCase(),
                loanQuantity: Number(material.loanQuantity),
            }))
            : undefined;

        return await loanRepository.update(loan_id, { ...data, materials });
    },
    async updateLoanStatus(loan_id, is_active) {
        // La tabla loans usa "loan_id" como llave primaria (se renombró desde
        // "id" en una migración anterior); esta consulta seguía usando "id",
        // que ya no existe, y eso rompía el switch de estado en la lista.
        const result = await pool.query(
            "UPDATE loans SET is_active = $1 WHERE loan_id = $2 RETURNING *",
            [is_active, loan_id]
        );
        return result.rows[0];
    },
};
