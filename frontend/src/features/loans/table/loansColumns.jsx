// Componente reutilizable que muestra un switch para activar o desactivar estados
import { Switch } from "@/shared";


// Componente que contiene los botones de acciones (editar y eliminar) para cada usuario
import LoanRowActions from "../components/LoanRowActions";
import { updateLoanStatus } from "../services/loanService";


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


        // Render personalizado de la celda
        // Permite mostrar un componente en lugar de solo texto
        cell: ({ row }) => {


            // Se obtiene el objeto completo del usuario de la fila
            const loan = row.original;


            // Función que se ejecuta cuando cambia el switch
            const handleChange = async (value) => {
                try {
                    await updateLoanStatus(loan.loan_id, value); // 👈 llamada al servicio
                    console.log("Estado actualizado en BD:", loan.loan_id, value);
                } catch (error) {
                    console.error("Error actualizando estado:", error.message);
                }
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
