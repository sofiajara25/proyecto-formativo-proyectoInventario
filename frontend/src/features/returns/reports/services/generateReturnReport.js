// import { returns } from "../../data/returns";
import { buildReportDataset } from "../utils/buildReportDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";
import { getReturns } from "../../services/returnService";
import { getLoans } from "../../../loans/services/loanService";

export async function generateReturnReport({
    format,
    selectedFields,
    scope,
    documentNumber,
}) {

    const [returns, loans] = await Promise.all([getReturns(), getLoans()]);

    // La tabla "returns" no guarda el usuario ni su documento (solo
    // "loan_id"), así que para poder mostrar/filtrar por esos datos en el
    // reporte hay que cruzarlos con el préstamo al que pertenece cada
    // devolución.
    const loansById = new Map(loans.map((l) => [String(l.loan_id), l]));
    const returnsWithUser = returns.map((r) => {
        const loan = loansById.get(String(r.loan_id));
        return {
            ...r,
            loan_user: loan?.loan_user ?? "",
            user_identification: loan?.user_identification ?? "",
        };
    });

    const { headers, rows } = buildReportDataset({
        returns: returnsWithUser,
        selectedFields,
        scope,
        documentNumber,
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