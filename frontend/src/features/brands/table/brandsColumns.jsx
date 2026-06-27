// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";

// Componente que contiene los botones de acciones (editar y eliminar) para cada marca
import BrandRowActions from "../components/BrandRowActions";

export const brandsColumns = [
    // Columna ID
    {
        accessorKey: "id", // Propiedad del objeto brand
        header: "Id",
    },

    // Columna Nombre
    {
        accessorKey: "marca", // Campo real en la base
        header: "Nombre",
    },

    // Columna Estado (activo / inactivo)
    {
        accessorKey: "brand_status", // Campo real en la base
        header: "Estado",
        cell: ({ row }) => {
            const brand = row.original;

            const handleChange = (value) => {
                console.log("Actualizar estado marca:", brand.id, value);
                // Aquí normalmente se llamaría a la API:
                // updateBrandStatus(brand.id, value)
            };

            return (
                <Switch
                    checked={brand.brand_status === "activo"} // o true/false según tu modelo
                    onChange={handleChange}
                    className="inline-flex"
                />
            );
        },
    },

    // Columna de acciones (editar / eliminar)
    {
        id: "actions",
        cell: ({ row }) => <BrandRowActions brand={row.original} />,
    },
];
