// import { returns } from "../../data/returns";
import { buildReportDataset } from "../utils/buildReportDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";
import { getReturns } from "../../services/returnService";

export async function generateReturnReport({
    format,
    selectedFields,
    scope,
    materialType
}) {

    const returns = await getReturns();
    const { headers, rows } = buildReportDataset({
        returns,
        selectedFields,
        scope,
        materialType
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