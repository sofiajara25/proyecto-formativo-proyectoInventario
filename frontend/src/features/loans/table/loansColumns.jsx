// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";


// Componente que contiene los botones de acciones (editar y eliminar) para cada usuario
import LoanRowActions from "../components/LoanRowActions";
import LoanStatusSwitch from "../components/LoanStatusSwitch";

// Definición de las columnas de la tabla de usuarios
// Este arreglo suele usarse en librerías de tablas como TanStack Table
export const loansColumns = [


    // Columna ID
    {
        accessorKey: "loan_id", // Propiedad del objeto user que se mostrará en la columna
        header: "Id",      // Título de la columna
    },

    // Columna Nombre
    {
        accessorKey: "loan_user", // Campo del objeto user
        header: "Usuario",    // Encabezado visible
    },

    {
        accessorKey: "user_identification", // Campo del objeto user
        header: "Identificación del Usuario",    // Encabezado visible
    },

    // Columna Email
    {
        accessorKey: "category",
        header: "Categoria",
    },


    // Columna Dirección
    {
        accessorKey: "product_name",
        header: "Nombre del producto",
    },

    {
        accessorKey: "description",
        header: "Descripción",
    },


    // Columna Estado (activo / inactivo)
    {
        accessorKey: "is_active",
        header: "Estado",
        cell: ({ row }) => <LoanStatusSwitch loan={row.original} />,
    },

    // Columna de acciones (editar / eliminar)
    {
        id: "actions", // No usa accessorKey porque no corresponde a un campo del usuario


        // Renderiza el componente de acciones pasando el usuario completo
        cell: ({ row }) => <LoanRowActions loan={row.original} />,
    },
];
