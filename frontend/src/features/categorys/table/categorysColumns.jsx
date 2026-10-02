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
        // Las 3 categorías por defecto llevan una etiqueta para que se
        // entienda por qué no se pueden desactivar.
        cell: ({ row }) => (
            <span className="inline-flex items-center gap-2">
                {row.original.category_name}
                {row.original.is_default && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        Por defecto
                    </span>
                )}
            </span>
        ),
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
