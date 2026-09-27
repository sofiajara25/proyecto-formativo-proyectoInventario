import { activityLogService } from "./activityLog.service.js";

export const activityLogController = {
    async list(req, res) {
        try {
            const { page, module } = req.query;
            const result = await activityLogService.getLogs({ page, module });
            res.status(200).json(result);
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },
};
