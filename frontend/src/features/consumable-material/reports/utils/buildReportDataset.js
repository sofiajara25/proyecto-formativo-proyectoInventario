export function buildReportDataset({
    consumables,
    selectedFields,
    scope,
    senaPlate,
    filterStatus
}) {
    let filteredConsumables = [...consumables];

    // Filtro por placa SENA
    if (scope === "senaPlate" && senaPlate) {
        filteredConsumables = filteredConsumables.filter(
            (c) => c.senaPlate === senaPlate
        );
    }

    // Filtro por estado
    if (filterStatus) {
        filteredConsumables = filteredConsumables.filter(
            (c) => String(c.status).toLowerCase() === String(filterStatus).toLowerCase()
        );
    }

    // Evitar duplicados
    const uniqueFields = selectedFields.filter(
        (field, index, self) => index === self.findIndex((f) => f.key === field.key)
    );

    const headers = uniqueFields.map((field) => field.label);
    const rows = filteredConsumables.map((consumable) =>
        uniqueFields.map((field) => consumable[field.key] ?? "")
    );

    return { headers, rows };
}
