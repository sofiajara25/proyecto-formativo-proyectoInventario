// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";


// Componente que contiene los botones de acciones (editar y eliminar) para cada usuario
import UserRowActions from "../components/UserRowActions";
import UserStatusSwitch from "../components/UserStatusSwitch";


// Definición de las columnas de la tabla de usuarios
// Este arreglo suele usarse en librerías de tablas como TanStack Table
export const usersColumns = [

    // Columna Nombre
    {
        accessorKey: "user_name", // Campo del objeto user
        header: "Nombre",    // Encabezado visible
    },
    {
        accessorKey: "user_lastname", // Campo del objeto user
        header: "Apellido",    // Encabezado visible
    },
    {
        accessorKey: "document_number",
        header: "Número documento",
    },
    {
        accessorKey: "group_name",
        header: "Tipo de usuario",
        cell: ({ row }) => row.original.group_name || "Sin grupo"
    },
    // Columna Email
    {
        accessorKey: "user_email",
        header: "Email",
    },
    // Columna Dirección
    {
        accessorKey: "user_phone",
        header: "Teléfono",
    },

    {
        accessorKey: "user_status",
        header: "Estado",
        cell: ({ row }) => <UserStatusSwitch user={row.original} />,
    },

    // Columna de acciones (editar / eliminar)
    {
        id: "actions", // No usa accessorKey porque no corresponde a un campo del usuario


        // Renderiza el componente de acciones pasando el usuario completo
        cell: ({ row }) => <UserRowActions user={row.original} />,
    },
];
