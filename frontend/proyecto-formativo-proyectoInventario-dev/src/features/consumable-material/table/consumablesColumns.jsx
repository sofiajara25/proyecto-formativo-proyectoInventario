// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";
import ConsumableRowActions from "../components/ConsumableRowActions";

export const consumablesColumns = [

    {
        accessorKey: "id",
        header: "ID",
        size: 80,
    },
    {
        accessorKey: "custodian",
        header: "Encargado",
    },
    {
        accessorKey: "materialName",
        header: "Nombre del Material",
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
        id: "actions",
        cell: ({ row }) => <ConsumableRowActions user={row.original} />,
    },
];