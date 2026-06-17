import { accessService } from "../features/access/access.service.js"

export const requirePermission = (permissionCode) => {
    return async (req, res, next) => {
        const userId = req.user.id;

        const granted = await accessService.hasPermission(userId, permissionCode);

        if (!granted) {
            return res.status(401).json({
                message: "No tiene permisos para realizar esta acción",
            });
        }

        next();
    };
};