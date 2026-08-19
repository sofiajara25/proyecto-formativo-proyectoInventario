import { getInventoryName } from "../../services/inventoryNameService";
import { buildReportDataset } from "../utils/buildReportsDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";
export async function generateInventoryNameReport({ format, selectedFields, scope, name }) {
    const inventoryNames = await getInventoryName(); // traer desde backend

    const { headers, rows } = buildReportDataset({
        inventoryNames,
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
            fileName: `inventoryNames-report-${new Date().toISOString().slice(0, 10)}.xlsx`
        });
    } else {
        generatePdfReport({
            headers,
            rows,
            fileName: `inventoryNames-report-${new Date().toISOString().slice(0, 10)}.pdf`
        });
    }
}
