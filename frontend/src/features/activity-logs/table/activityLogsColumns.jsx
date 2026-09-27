const ACTION_LABELS = {
    create: "Creó",
    update: "Actualizó",
    status: "Cambió estado",
};

const MODULE_LABELS = {
    users: "Usuarios",
    consumableMaterial: "Materiales de consumo",
    returnableMaterial: "Materiales devolutivos",
    brands: "Marcas",
    loan: "Préstamos",
    returns: "Devoluciones",
    groups: "Grupos",
    tasks: "Tareas",
    "inventory-names": "Nombres de inventario",
    categorys: "Categorías",
    quotations: "Cotizaciones",
    "loan-signatures": "Firmas de préstamo",
    permissions: "Permisos",
};

function formatDateTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export const activityLogsColumns = [
    {
        accessorKey: "created_at",
        header: "Fecha y hora",
        cell: ({ row }) => formatDateTime(row.original.created_at),
    },
    {
        accessorKey: "user_name",
        header: "Usuario",
        cell: ({ row }) => row.original.user_name || "—",
    },
    {
        accessorKey: "action",
        header: "Acción",
        cell: ({ row }) => ACTION_LABELS[row.original.action] || row.original.action,
    },
    {
        accessorKey: "module",
        header: "Módulo",
        cell: ({ row }) => MODULE_LABELS[row.original.module] || row.original.module,
    },
    {
        accessorKey: "description",
        header: "Descripción",
    },
];
