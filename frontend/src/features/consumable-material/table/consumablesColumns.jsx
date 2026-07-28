// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";
import ConsumableRowActions from "../components/ConsumableRowActions";
import ConsumableStatusSwitch from "../components/ConsumableStatusSwitch";

export const consumablesColumns = [
    {
        accessorKey: "accountant",
        header: "Cuentadante",
    },
    {
        accessorKey: "tool_id",
        header: "ID Herramienta",
    },
    {
        accessorKey: "sena_plate",
        header: "Placa SENA",
    },
    {
        accessorKey: "material_name",
        header: "Nombre del material",
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => <ConsumableStatusSwitch consumable={row.original} />,
    },

    {
        id: "actions",
        cell: ({ row }) => <ConsumableRowActions consumable={row.original} />,
    },
];