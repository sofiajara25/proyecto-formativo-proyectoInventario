import { consumables } from "../../data/consumables";
import { buildReportDataset } from "../utils/buildReportDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

export function generateConsumableReport({
    format,
    selectedFields,
    scope,
    senaPlate,
    filterStatus
}) {
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

    if (format.toLowerCase() === "excel") {
        generateExcelReport({
            headers,
            rows,
            fileName: `consumables-report-${new Date().toISOString().slice(0, 10)}.xlsx`
        });
    } else if (format.toLowerCase() === "pdf") {
        generatePdfReport({
            headers,
            rows,
            fileName: `consumables-report-${new Date().toISOString().slice(0, 10)}.pdf`
        });
    }
}