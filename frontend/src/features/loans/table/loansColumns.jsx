// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";


// Componente que contiene los botones de acciones (editar y eliminar) para cada usuario
import LoanRowActions from "../components/LoanRowActions";


// Definición de las columnas de la tabla de usuarios
// Este arreglo suele usarse en librerías de tablas como TanStack Table
export const loansColumns = [


    // Columna ID
    {
        accessorKey: "id", // Propiedad del objeto user que se mostrará en la columna
        header: "Id",      // Título de la columna
    },

    // Columna Nombre
    {
        accessorKey: "user", // Campo del objeto user
        header: "Usuario",    // Encabezado visible
    },


    // Columna Email
    {
        accessorKey: "category",
        header: "Categoria",
    },


    // Columna Dirección
    {
        accessorKey: "materialName",
        header: "Nombre del material",
    },

    {
        accessorKey: "loanDate",
        header: "Fecha de Préstamo",
    },

    {
        accessorKey: "returnDate",
        header: "Fecha de Devolución",
    },

    {
        accessorKey: "description",
        header: "Descripción",
    },


    // Columna Estado (activo / inactivo)
    {
        accessorKey: "is_active",
        header: "Estado",


        // Render personalizado de la celda
        // Permite mostrar un componente en lugar de solo texto
        cell: ({ row }) => {


            // Se obtiene el objeto completo del usuario de la fila
            const loan = row.original;


            // Función que se ejecuta cuando cambia el switch
            const handleChange = (value) => {


                // value representa el nuevo estado del switch (true o false)
                console.log("Actualizar estado usuario:", loan.loan_id, value);


                // Aquí normalmente se llamaría una API para actualizar el estado
                // updateUserStatus(user.user_id, value)
            };


            return (
                // Componente reutilizable para mostrar el switch
                <Switch
                    checked={loan.is_active} // Estado actual del usuario
                    onChange={handleChange}  // Función que maneja el cambio
                    className="inline-flex"
                />
            );
        },
    },


    // Columna de acciones (editar / eliminar)
    {
        id: "actions", // No usa accessorKey porque no corresponde a un campo del usuario


        // Renderiza el componente de acciones pasando el usuario completo
        cell: ({ row }) => <LoanRowActions loan={row.original} />,
    },
];
