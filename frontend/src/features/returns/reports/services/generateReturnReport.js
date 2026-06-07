import { returns } from "../../data/returns";
import { buildReportDataset } from "../utils/buildReportDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

export function generateReturnReport({
    format,
    selectedFields,
    scope,
    returnDate
}) {
    const { headers, rows } = buildReportDataset({
        returns,
        selectedFields,
        scope,
        returnDate
    });

    if (!rows.length) {
        alert("No hay datos para generar el reporte.");
        return;
    }

    if (format.toLowerCase() === "excel") {
        generateExcelReport({
            headers,
            rows,
            fileName: `returns-report-${new Date().toISOString().slice(0, 10)}.xlsx`
        });
    } else if (format.toLowerCase() === "pdf") {
        generatePdfReport({
            headers,
            rows,
            fileName: `returns-report-${new Date().toISOString().slice(0, 10)}.pdf`
        });
    }
}