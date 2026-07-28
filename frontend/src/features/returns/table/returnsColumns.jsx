// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch, formatDate } from "@/shared";


// Componente que contiene los botones de acciones (editar y eliminar) para cada usuario
import ReturnRowActions from "../components/ReturnRowActions";
import ReturnStatusSwitch from "../components/ReturnStatusSwitch";


// Definición de las columnas de la tabla de usuarios
// Este arreglo suele usarse en librerías de tablas como TanStack Table
export const returnsColumns = [

    {
        accessorKey: "material_type", // Campo del objeto user
        header: "Tipo de Material",    // Encabezado visible
    },


    // Columna Prestamo
    {
        accessorKey: "loan_id", // Campo del objeto user
        header: "Id Prestamo",    // Encabezado visible
    },


    // Columna Fecha de devolucion
    {
        accessorKey: "return_date",
        cell: ({ row }) => formatDate(row.original.return_date),
        header: "Fecha de devolución",
    },

    // Columna Estado (activo / inactivo)
    {
        accessorKey: "is_available",
        header: "Estado",
        cell: ({ row }) => <ReturnStatusSwitch refund={row.original} />,
    },


    // Columna de acciones (editar / eliminar)
    {
        id: "actions", // No usa accessorKey porque no corresponde a un campo del usuario


        // Renderiza el componente de acciones pasando el usuario completo
        cell: ({ row }) => <ReturnRowActions refund={row.original} />,
    },
];
