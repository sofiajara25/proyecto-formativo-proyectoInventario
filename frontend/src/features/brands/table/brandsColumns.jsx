// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";

// Componente que contiene los botones de acciones (editar y eliminar) para cada marca
import BrandRowActions from "../components/BrandRowActions";
import BrandStatusSwitch from "../components/BrandStatusSwitch";

export const brandsColumns = [

    // Columna Nombre
    {
        accessorKey: "marca", // Campo real en la base
        header: "Nombre",
    },

    // Columna Estado (activo / inactivo)
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => <BrandStatusSwitch brand={row.original} />,
    },

    // Columna de acciones (editar / eliminar)
    {
        id: "actions",
        cell: ({ row }) => <BrandRowActions brand={row.original} />,
    },
];
