// funcion utilitaria para construir el dataset de un reporte (tabla)
// patron: transformacion de datos (input => output listo para exportar)

export function buildReportDataset({
    loans,          // array de prestamos origen
    selectedFields, // campos seleccionados [{key, label}]
    scope,          // alcance: "all" | "user"
    name            // nombre del usuario para filtrar (si aplica)
}) {

    // copia inmutable del array original
    let filteredLoans = [...loans];

    // filtro por usuario si aplica
    if (scope === "name" && name) {
        filteredLoans = filteredLoans.filter(
            (loan) => loan.user === name // corregido: era loan.name, debe ser loan.user
        );
    }

    // encabezados del reporte
    const headers = selectedFields.map((field) => field.label);

    // filas del reporte
    const rows = filteredLoans.map((loan) =>
        selectedFields.map((field) => {
            const value = loan[field.key];
            return value ?? "";
        })
    );

    return { headers, rows };
}