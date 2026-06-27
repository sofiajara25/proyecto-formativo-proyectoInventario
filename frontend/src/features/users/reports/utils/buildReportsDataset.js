// Función utilitaria para construir el dataset de un reporte (tabla)
// Patrón: transformación de datos (input => output listo para exportar)

export function buildReportDataset({
    users,          // Array de usuarios origen
    selectedFields, // Campos seleccionados para el reporte [{ key, label }]
    scope,          // Alcance del reporte: "all" | "document"
    documentNumber  // Número de documento para filtrar (si aplica)
}) {
    // Copia inmutable del array original (evita mutaciones)
    let filteredUsers = [...users];

    // Filtro por alcance: si es documento, se aplica filtro específico
    if (scope === "document" && documentNumber) {
        filteredUsers = filteredUsers.filter(
            (user) => user.document_number === documentNumber
        );
    }

    // Construcción de encabezados del reporte
    const headers = selectedFields.map((field) => field.label);

    // Construcción de filas del reporte
    const rows = filteredUsers.map((user) =>
        selectedFields.map((field) => {
            const value = user[field.key]; // acceso dinámico a la propiedad
            return value ?? "";            // normalización: evita undefined/null
        })
    );

    // Estructura final desacoplada de la UI
    return {
        headers,
        rows,
    };
}
