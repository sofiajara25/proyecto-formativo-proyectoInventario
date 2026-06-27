import { getConsumables } from "../../services/consumableMaterialService"; // ahora usa datos reales del backend
import { buildReportDataset } from "../utils/buildReportDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

export async function generateConsumableReport({
    format,
    selectedFields,
    scope,
    senaPlate,
    filterStatus
}) {
    // Traer datos reales del backend
    const consumables = await getConsumables();

    const { headers, rows } = buildReportDataset({
        consumables,
        selectedFields,
        scope,
        senaPlate,
        filterStatus,
    });

    if (!rows.length) {
        alert("No hay datos para generar el reporte.");
        return;
    }

    const date = new Date().toISOString().slice(0, 10);

    if (format.toLowerCase() === "excel") {
        generateExcelReport({
            headers,
            rows,
            fileName: `consumables-report-${date}.xlsx`,
        });
    } else {
        generatePdfReport({
            headers,
            rows,
            fileName: `consumables-report-${date}.pdf`,
        });
    }
}
