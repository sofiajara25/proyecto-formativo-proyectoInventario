export function buildReportDataset({
    consumables,
    selectedFields,
    scope,
    senaPlate
}) {
    let filteredConsumables = [...consumables];

    if (scope === "senaPlate" && senaPlate) {
        filteredConsumables = filteredConsumables.filter(
            (consumable) => consumable.senaPlate === senaPlate
        );
    }


    const uniqueFields = selectedFields.filter(
        (field, index, self) => index === self.findIndex((f) => f.key === field.key)
    );

    const headers = uniqueFields.map((field) => field.label);

    const rows = filteredConsumables.map((consumable) =>
        uniqueFields.map((field) => consumable[field.key] ?? "")
    );

    return { headers, rows };
}