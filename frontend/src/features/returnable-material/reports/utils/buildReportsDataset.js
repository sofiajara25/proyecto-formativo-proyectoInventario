export function buildReportDataset({
    returnables,
    selectedFields,
    scope,
    materialSenaPlate
}) {
    let filteredReturnables = [...returnables];

    if (scope === "materialSenaPlate" && materialSenaPlate) {
        filteredReturnables = filteredReturnables.filter(
            (returnable) => returnable.materialSenaPlate === materialSenaPlate
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