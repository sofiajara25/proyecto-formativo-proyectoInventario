import { loans } from "../../data/loans";
import { buildReportDataset } from "../utils/buildReportsDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

export function generateLoanReport({
    format,
    selectedFields,
    scope,
    name
}) {

    const { headers, rows } = buildReportDataset({
        loans,
        selectedFields,
        scope,
        name
    });

    if (!rows.length) {
        alert("No hay datos para generar el reporte.");
        return;
    }

    if (format.toLowerCase() === "excel") {
        generateExcelReport({
            headers,
            rows,
            fileName: `loans-report-${new Date().toISOString().slice(0, 10)}.xlsx`
        });
    } else if (format.toLowerCase() === "pdf") {
        generatePdfReport({
            headers,
            rows,
            fileName: `loans-report-${new Date().toISOString().slice(0, 10)}.pdf`
        });
    }
}