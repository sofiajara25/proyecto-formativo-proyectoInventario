export function buildReportDataset({
    returnables,
    selectedFields,
    scope,
    materialSenaPlate,
    inventoryNameId
}) {
    let filteredReturnables = [...returnables];

    if (scope === "materialSenaPlate" && materialSenaPlate) {
        filteredReturnables = filteredReturnables.filter(
            (returnable) => returnable.materialSenaPlate === materialSenaPlate
        );
    }

    // Filtro por nombre de inventario (ej. Software, Teleinformática)
    if (scope === "inventoryName" && inventoryNameId) {
        filteredReturnables = filteredReturnables.filter(
            (returnable) => String(returnable.inventory_name_id) === String(inventoryNameId)
        );
    }


    const uniqueFields = selectedFields.filter(
        (field, index, self) => index === self.findIndex((f) => f.key === field.key)
    );

    const headers = uniqueFields.map((field) => field.label);

    const rows = filteredReturnables.map((returnable) =>
        uniqueFields.map((field) => returnable[field.key] ?? "")
    );

    return { headers, rows };
}