// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";
import ReturnableRowAction from "../components/ReturnableRowAction";
import ReturnableStatusSwitch from "../components/ReturnableStatusSwitch";

export const returnableColumns = [

    {
        accessorKey: "custodian",
        header: "Encargado",
    },

    {
        accessorKey: "material_name",
        header: "Nombre Material",
    },

    {
        accessorKey: "quantity",
        header: "Cantidad",
    },

    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => <ReturnableStatusSwitch material={row.original} />,
    },

    {
        accessorKey: "actions",
        header: "Acciones",
        cell: ({ row }) => <ReturnableRowAction retornable={row.original} />,
    },
];