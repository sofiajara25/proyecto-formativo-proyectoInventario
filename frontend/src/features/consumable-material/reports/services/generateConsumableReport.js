import { getConsumables } from "../../services/consumableMaterialService"; // ahora usa datos reales del backend
import { buildReportDataset } from "../utils/buildReportDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";
import { showAlert } from "@/shared/utils/alertBus";

export async function generateConsumableReport({
    format,
    selectedFields,
    scope,
    senaPlate,
    filterStatus,
    inventoryNameId
}) {
    // Traer datos reales del backend
    const consumables = await getConsumables();

    const { headers, rows } = buildReportDataset({
        consumables,
        selectedFields,
        scope,
        senaPlate,
        filterStatus,
        inventoryNameId,
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
            fileName: `consumables-report-${date}.xlsx`,
        });
    } else {
        generatePdfReport({
            headers,
            rows,
            fileName: `consumables-report-${date}.pdf`,
        });
    }
}

