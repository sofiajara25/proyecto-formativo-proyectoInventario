// import { returnables } from "../../data/returnables";
import { buildReportDataset } from "../utils/buildReportsDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";
import { getReturnables } from "../../services/returnableMaterialService";

export async function generateReturnableReport({
    format,
    selectedFields,
    scope,
    senaPlate,
    filterStatus,
    inventoryNameId
}) {

    const returnables = await getReturnables();
    const { headers, rows } = buildReportDataset({
        returnables,
        selectedFields,
        scope,
        senaPlate,
        filterStatus,
        inventoryNameId,
    });

    if (!rows.length) {
        alert("No hay datos para generar el reporte.");
        return;
    }

    if (format.toLowerCase() === "excel") {
        generateExcelReport({
            headers,
            rows,
            fileName: `returnables-report-${new Date().toISOString().slice(0, 10)}.xlsx`
        });
    } else if (format.toLowerCase() === "pdf") {
        generatePdfReport({
            headers,
            rows,
            fileName: `returnables-report-${new Date().toISOString().slice(0, 10)}.pdf`
        });
    }
}