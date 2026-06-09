// backend/src/features/auth.service.js
// Logica de autenticacion + JWT

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "./auth.repository.js";

export const authService = {
    async login({ email, password }) {
        const user = await authRepository.findByEmail(email);

        console.log("USER ENCONTRADO: ", user);

        if (!user) {
            throw new Error("Credenciales invalidas");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // const isMatch = password === user.password;

        if (!isMatch) {
            throw new Error("Credenciales invalidas");
        }

        if (user.status !== "Activo") {
            throw new Error("Usuario inactivo");
        }

        const token = jwt.sign(
            { id: user.id, email: user.user_email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES },
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.user_email
            },
        };
    },
};