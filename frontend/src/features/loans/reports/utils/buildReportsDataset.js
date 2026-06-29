// funcion utilitaria para construir el dataset de un reporte (tabla)
// patron: transformacion de datos (input => output listo para exportar)

export function buildReportDataset({
    loans,          // array de prestamos origen
    selectedFields, // campos seleccionados [{key, label}]
    scope,          // alcance: "all" | "user"
    loanUser            // nombre del usuario para filtrar (si aplica)
}) {

    // copia inmutable del array original
    let filteredLoans = [...loans];

    // filtro por usuario si aplica
    if (scope === "loanUser" && loanUser) {
        filteredLoans = filteredLoans.filter(
            (loan) => loan.loanUser === loanUser // corregido: era loan.name, debe ser loan.user
        );
    }

    // Evitar duplicados
    const uniqueFields = selectedFields.filter(
        (field, index, self) => index === self.findIndex((f) => f.key === field.key)
    );

    // encabezados del reporte
    const headers = uniqueFields.map((field) => field.label);

    // filas del reporte
    const rows = filteredLoans.map((loan) =>
        uniqueFields.map((field) => loan[field.key] ?? "")
    );

    return { headers, rows };
}