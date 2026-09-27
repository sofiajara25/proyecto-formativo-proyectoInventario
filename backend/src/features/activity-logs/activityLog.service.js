import { activityLogRepository } from "./activityLog.repository.js";

// El frontend usa DataTable, que ya pagina/filtra en el navegador (ver
// shared/components/DataTable.jsx), así que basta con traer un lote
// razonablemente grande de una sola vez en vez de armar paginación de
// servidor en la UI. Si la bitácora crece mucho, acá es donde se bajaría
// este número y se conectaría paginación real en LogsPage.jsx.
const DEFAULT_LIMIT = 200;
const MAX_LIMIT = 500;

export const activityLogService = {
    async getLogs({ page, module, limit: requestedLimit }) {
        const currentPage = Math.max(1, Number(page) || 1);
        const limit = Math.min(Number(requestedLimit) || DEFAULT_LIMIT, MAX_LIMIT);
        const offset = (currentPage - 1) * limit;

        const [logs, total, modules] = await Promise.all([
            activityLogRepository.list({ limit, offset, module }),
            activityLogRepository.count({ module }),
            activityLogRepository.listModules(),
        ]);

        return {
            logs,
            modules,
            pagination: {
                page: currentPage,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    },
};
