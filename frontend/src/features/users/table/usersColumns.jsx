// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";


// Componente que contiene los botones de acciones (editar y eliminar) para cada usuario
import UserRowActions from "../components/UserRowActions";


// Definición de las columnas de la tabla de usuarios
// Este arreglo suele usarse en librerías de tablas como TanStack Table
export const usersColumns = [

    // Columna Nombre
    {
        accessorKey: "user_name", // Campo del objeto user
        header: "Nombre",    // Encabezado visible
    },
    {
        accessorKey: "document_type",
        header: "Tipo documento",
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
        accessorKey: "user_address",
        header: "Dirección",
    },
    {
        accessorKey: "user_phone",
        header: "Teléfono",
    },

    {
        accessorKey: "user_status",
        header: "Estado",
        cell: ({ row }) => {
            const user = row.original;

            const handleChange = (value) => {
                console.log("Actualizar estado usuario:", user.id, value);
                // Aquí llamas a tu API updateUserStatus(user.id, value)
            };

            return (
                <Switch
                    checked={user.userStatus === "Activo"}
                    onChange={(checked) => handleChange(checked ? "Activo" : "Inactivo")}
                    className="inline-flex"
                />
            );
        },
    },

    // Columna de acciones (editar / eliminar)
    {
        id: "actions", // No usa accessorKey porque no corresponde a un campo del usuario


        // Renderiza el componente de acciones pasando el usuario completo
        cell: ({ row }) => <UserRowActions user={row.original} />,
    },
];
