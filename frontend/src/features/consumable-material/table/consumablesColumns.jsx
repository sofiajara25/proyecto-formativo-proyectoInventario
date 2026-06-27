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
        cell: ({ row }) => <ConsumableRowActions consumable={row.original} />,
    },
];