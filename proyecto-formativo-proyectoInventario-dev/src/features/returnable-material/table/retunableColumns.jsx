// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";
import ReturnableRowAction from "../components/ReturnableRowAction";

export const retunableColumns = [

    {
        accessorKey: "id",
        header: "Id",
    },

    {
        accessorKey: "custodian",
        header: "Encargado",
    },

    {
        accessorKey: "materialName",
        header: "Nombre Material",
    },

    {
        accessorKey: "quantity",
        header: "Cantidad",
    },

    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const consumable = row.original;
            const handleChange = (value) => {
                console.log("Actualizar estado:", consumable.id, value);
            };
            return (
                <Switch
                    checked={consumable.status}
                    onChange={handleChange}
                    className="inline-flex"
                />
            );
        },
    },

    {
        accessorKey: "actions",
        header: "Acciones",
        cell: ({ row }) => <ReturnableRowAction returnable={row.original} />,
    },
];