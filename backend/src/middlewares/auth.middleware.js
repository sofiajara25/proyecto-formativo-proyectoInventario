import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Token requerido",
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token inválido",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Solo se permite una sesión activa por usuario (ver auth.service.js
        // -> login). Si en otro lado se inició sesión (o se forzó el
        // cierre de esta), el active_token guardado ya no es este, así que
        // esta petición se rechaza aunque el JWT en sí no haya expirado
        // todavía. Esto es lo que realmente "saca" a la otra sesión, en
        // vez de solo impedir un nuevo login.
        const result = await pool.query(
            "SELECT active_token FROM users WHERE id = $1 LIMIT 1;",
            [decoded.id]
        );
        const activeToken = result.rows[0]?.active_token;

        if (activeToken && activeToken !== token) {
            return res.status(401).json({
                message: "Tu sesión se cerró porque iniciaste sesión en otro lugar",
                code: "SESSION_REPLACED",
            });
        }

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token inválido o expirado",
        });
    }
};