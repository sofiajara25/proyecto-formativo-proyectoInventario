import { accessService } from "./access.service.js";

export const accessController = {
    async testPermission(req, res) {
        const userId = Number(req.params.userId);

        const hasPermission = await accessService.hasPermission(
            userId,
            "list_user",
        );

        res.json({
            userId,
            permission: "list_user",
            granted: hasPermission,
        });
    },
};