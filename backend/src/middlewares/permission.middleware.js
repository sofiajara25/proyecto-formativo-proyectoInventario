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
// No hay atajos para ningún grupo, ni siquiera uno llamado
// "Administrador": ese grupo necesita tener sus permisos asignados
// explícitamente en Grupos y permisos como cualquier otro. La única
// excepción real es el Super Administrador (users.is_super_admin), que
// por definición tiene acceso a todo el sistema sin que se le tengan que
// asignar permisos uno por uno.
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

            const isSuperAdmin = await accessRepository.isSuperAdmin(req.user.id);
            if (isSuperAdmin) {
                return next();
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

// Igual que requirePermission, pero basta con tener UNO de los permisos
// indicados. Sirve para datos de apoyo que usan varias pantallas (ej. la
// lista de usuarios para elegir cuentadantes, que la necesitan quienes
// crean o editan materiales de consumo o devolutivos).
// Permisos de quien llena los formularios de material (crear o editar,
// consumo o devolutivo). Quien los tiene necesita poder ELEGIR marcas,
// categorías, nombres de inventario y cotizaciones en los selects, aunque
// no tenga el permiso de "listar" ese catálogo como módulo aparte.
export const MATERIAL_FORM_PERMISSIONS = [
    "create_consumable_material",
    "modify_consumable_material",
    "create_returnable_material",
    "modify_returnable_material",
];

// Igual que MATERIAL_FORM_PERMISSIONS, para los demás formularios: quien
// puede crear o editar un préstamo necesita ver los materiales y usuarios
// en los selects; quien registra un retorno necesita ver los préstamos; y
// quien asigna tareas necesita ver los usuarios. El permiso de "listar" ese
// módulo es aparte y sigue controlando la pantalla del listado.
export const LOAN_FORM_PERMISSIONS = ["create_loan", "modify_loan"];
export const RETURN_FORM_PERMISSIONS = ["create_return", "modify_return"];
export const TASK_FORM_PERMISSIONS = ["create_task", "modify_task"];

export function requireAnyPermission(codenames) {
    return async (req, res, next) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({ error: "Token requerido" });
            }

            const isSuperAdmin = await accessRepository.isSuperAdmin(req.user.id);
            if (isSuperAdmin) {
                return next();
            }

            const permissions = await accessRepository.getUserPermissions(req.user.id);

            if (codenames.some((codename) => permissions.includes(codename))) {
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
