import { formatDate } from "@/shared";

export function buildReportDataset({
    consumables,
    selectedFields,
    scope,
    senaPlate,
    filterStatus,
    inventoryNameId
}) {
    let filteredConsumables = [...consumables];

    // Filtro por placa SENA
    if (scope === "senaPlate" && senaPlate) {
        filteredConsumables = filteredConsumables.filter(
            (c) => c.senaPlate === senaPlate
        );
    }

    // Filtro por nombre de inventario (ej. Software, Teleinformática)
    if (scope === "inventoryName" && inventoryNameId) {
        filteredConsumables = filteredConsumables.filter(
            (c) => String(c.inventory_name_id) === String(inventoryNameId)
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
        uniqueFields.map((field) => {
            const value = consumable[field.key] ?? "";
            if (Array.isArray(value)) return value.join(", ");
            return field.key.toLowerCase().includes("date") ? formatDate(value) : value;
        })
    );

    return { headers, rows };
}
