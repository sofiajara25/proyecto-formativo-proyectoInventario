// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";

// Componente que contiene los botones de acciones (editar y eliminar) para cada marca
import CategoryRowActions from "../components/CategoryRowActions";
import CategoryStatusSwitch from "../components/CategoryStatusSwitch";

export const categorysColumns = [

    // Columna Nombre
    {
        accessorKey: "category_name", // Campo real en la base
        header: "Nombre",
    },

    {
        accessorKey: "element_type", // Campo real en la base
        header: "Tipo de elemento",
    },

    // Columna Estado (activo / inactivo)
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => <CategoryStatusSwitch category={row.original} />,
    },

    // Columna de acciones (editar / eliminar)
    {
        id: "actions",
        cell: ({ row }) => <CategoryRowActions category={row.original} />,
    },
];
