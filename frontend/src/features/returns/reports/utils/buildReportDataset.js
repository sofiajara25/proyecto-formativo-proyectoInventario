// Function utilitaria  para construir el dataset de un reporte (tabla)
// Patrón: transformacion de datos (input => output listo para exportar)

import { formatDate } from "@/shared";

export function buildReportDataset({
    returns,          // Array de retornos origen (ya cruzados con el préstamo)
    selectedFields, // Campos seleccionados para el reporte [{key,label}]
    scope,          // Alcance del reporte: "all" | "document"
    documentNumber, // Número de documento del usuario para filtrar (si scope === "document")
}) {

    // Copia inmutable del array original (evita mutaciones)
    let filteredReturns = [...returns];

    // Filtro por alcance
    if (scope === "document" && documentNumber) {
        // Coincidencia parcial e insensible a mayúsculas: el número de
        // documento viene del préstamo asociado a cada retorno
        // (user_identification), no de la tabla "returns" directamente.
        const needle = documentNumber.trim().toLowerCase();
        filteredReturns = filteredReturns.filter((r) =>
            (r.user_identification ?? "").toLowerCase().includes(needle)
        );
    }

    const uniqueFields = selectedFields.filter(
        (field, index, self) => index === self.findIndex((f) => f.key === field.key)
    );

    // Construccion de encabezados del reporte
    // Se toma el label de cada uno de los campos seleccionados
    const headers = selectedFields.map((field) => field.label);

    // Construccion de filas del reporte
    // Cada usuario se transforma en un arreglo de valores segun los campos seleccionados
    // Los campos "*_date" vienen del backend como timestamp completo
    // (ej. "2026-08-20T05:00:00.000Z"); en el reporte solo debe verse
    // año-mes-día, no la hora ni la "T"/"Z" del ISO.
    const rows = filteredReturns.map((returnable) =>
        uniqueFields.map((field) => {
            const value = returnable[field.key] ?? "";
            return field.key.toLowerCase().includes("date") ? formatDate(value) : value;
        })
    );

    // Estructura final desacoplada de la UI
    // Lista para exportar a Excel, PDF o renderizar una tabla
    return {
        headers,
        rows
    };
}