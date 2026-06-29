// Function utilitaria  para construir el dataset de un reporte (tabla)
// Patrón: transformacion de datos (input => output listo para exportar)

export function buildReportDataset({
    returns,          // Array de usuarios origen
    selectedFields, // Campos seleccionados para el reporte [{key,label}]
    scope,          // Alcance del reporte: "all" | "document"
    materialType  // Numero de documentos para filtrar (si aplica)
}) {

    // Copia inmutable del array original (evita mutaciones)
    let filteredReturns = [...returns];

    // Filtro por alcance: si es documento, se aplica filtro especifico
    if (scope === "materialType" && materialType) {
        filteredReturns = filteredReturns.filter(
            (brand) => brand.materialType === materialType  // Fix: typo "docuement_number" -> "document"
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
    const rows = filteredReturns.map((returnable) =>
        uniqueFields.map((field) => returnable[field.key] ?? "")
    );

    // Estructura final desacoplada de la UI
    // Lista para exportar a Excel, PDF o renderizar una tabla
    return {
        headers,
        rows
    };
}