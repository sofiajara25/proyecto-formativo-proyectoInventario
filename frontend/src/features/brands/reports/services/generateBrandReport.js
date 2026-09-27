// import { brands } from "../../data/brands";
import { buildReportDataset } from "../utils/buildReportsDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";
import { getBrands } from "../../service/brandService"
import { showAlert } from "@/shared/utils/alertBus";
export async function generateBrandReport({ format, selectedFields, scope, name }) {
    const brands = await getBrands(); // traer desde backend

    const { headers, rows } = buildReportDataset({
        brands,
        selectedFields,
        scope,
        name
    });

    if (!rows.length) {
        showAlert("No hay datos para generar el reporte.", { type: "error" });
        return;
    }

    if (format.toLowerCase() === "excel") {
        generateExcelReport({
            headers,
            rows,
            fileName: `brands-report-${new Date().toISOString().slice(0, 10)}.xlsx`
        });
    } else {
        generatePdfReport({
            headers,
            rows,
            fileName: `brands-report-${new Date().toISOString().slice(0, 10)}.pdf`
        });
    }
}

