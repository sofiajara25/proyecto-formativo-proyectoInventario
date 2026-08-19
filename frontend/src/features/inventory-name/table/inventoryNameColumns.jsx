// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";

// Componente que contiene los botones de acciones (editar y eliminar) para cada marca
import InventoryNameRowActions from "../components/InventoryNameRowActions";
import InventoryNameStatusSwitch from "../components/InventoryNameStatusSwitch";

export const inventoryNamesColumns = [

    // Columna Nombre
    {
        accessorKey: "inventory_name", // Campo real en la base
        header: "Nombre del Inventario",
    },

    // Columna Estado (activo / inactivo)
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => <InventoryNameStatusSwitch inventoryName={row.original} />,
    },

    // Columna de acciones (editar / eliminar)
    {
        id: "actions",
        cell: ({ row }) => <InventoryNameRowActions inventoryName={row.original} />,
    },
];
