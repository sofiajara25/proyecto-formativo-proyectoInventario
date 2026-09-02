// Middleware de autorización por permiso. Se usa DESPUÉS de
// authenticateToken (que confirma quién es la persona) para revisar si
// además tiene el permiso puntual para hacer esa acción.
//
// requirePermission("create_consumable_material") revisa:
// 1. Si el permiso está asignado directamente a su usuario, o heredado
//    por su grupo -> pasa.
// 2. Si no -> 403 (a diferencia de 401: aquí sí sabemos quién es, solo
//    que no puede hacer esto).
//
// Sin atajos: no hay bypass para ningún grupo, ni siquiera uno llamado
// "Administrador". Ese grupo necesita tener sus permisos asignados
// explícitamente en Grupos y permisos como cualquier otro.
//
// Reutiliza accessRepository, que es la misma consulta que ya usa
// /api/access/me para armar el resumen de acceso del frontend.
import { accessRepository } from "../features/access/access.repository.js";

export function requirePermission(codename) {
    return async (req, res, next) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({ error: "Token requerido" });
            }

            const permissions = await accessRepository.getUserPermissions(req.user.id);

            if (permissions.includes(codename)) {
                return next();
            }

            return res.status(403).json({
                error: "No tienes permiso para realizar esta acción",
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}

// Guarda exclusiva de Grupos y Permisos: solo la persona marcada como
// Super Administrador (users.is_super_admin) puede ver o modificar
// grupos, permisos de grupo o permisos individuales. Es independiente
// del sistema de permisos normal (requirePermission) y no lo reemplaza.
export function requireSuperAdmin() {
    return async (req, res, next) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({ error: "Token requerido" });
            }

            const isSuperAdmin = await accessRepository.isSuperAdmin(req.user.id);

            if (isSuperAdmin) {
                return next();
            }

            return res.status(403).json({
                error: "Solo el Super Administrador puede realizar esta acción",
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}
