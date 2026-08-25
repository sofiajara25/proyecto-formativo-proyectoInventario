// import { categorys } from "../../data/brands";
import { getCategorys } from "../../service/categoryService";
import { buildReportDataset } from "../utils/buildReportsDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

export async function generateCategoryReport({ format, selectedFields, scope, name }) {
    const categorys = await getCategorys(); // traer desde backend

    const { headers, rows } = buildReportDataset({
        categorys,
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
            fileName: `categorys-report-${new Date().toISOString().slice(0, 10)}.xlsx`
        });
    } else {
        generatePdfReport({
            headers,
            rows,
            fileName: `categorys-report-${new Date().toISOString().slice(0, 10)}.pdf`
        });
    }
}
