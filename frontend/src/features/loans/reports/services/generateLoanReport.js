// import { loans } from "../../data/loans";
import { buildReportDataset } from "../utils/buildReportsDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";
import { getLoans } from "../../services/loanService";
import { showAlert } from "@/shared/utils/alertBus";

export async function generateLoanReport({
    format,
    selectedFields,
    scope,
    name
}) {

    const loans = await getLoans();

    const { headers, rows } = buildReportDataset({
        loans,
        selectedFields,
        scope,
        name
    });

    if (!rows.length) {
        showAlert("No hay datos para generar el reporte.", { type: "error" });
        return;
    }

    const date = new Date().toISOString().slice(0, 10);

    if (format.toLowerCase() === "excel") {
        generateExcelReport({
            headers,
            rows,
            fileName: `loans-report-${date}.xlsx`
        });
    } else if (format.toLowerCase() === "pdf") {
        generatePdfReport({
            headers,
            rows,
            fileName: `loans-report-${date}.pdf`
        });
    }
}