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

    // "category" y "product_name" en la fila son solo un respaldo del
    // PRIMER material (para listados/reportes viejos) y es fácil que queden
    // desincronizados si se edita el préstamo. La fuente real y siempre
    // actualizada es "materials" (viene de loan_items en cada consulta), así
    // que la lista arma estas dos columnas a partir de ahí directamente.
    {
        id: "category",
        header: "Categoria",
        cell: ({ row }) => {
            const materials = row.original.materials;
            if (!Array.isArray(materials) || materials.length === 0) {
                return row.original.category || "—";
            }
            const categorias = [...new Set(materials.map((m) => m.category).filter(Boolean))];
            return categorias.join(", ") || "—";
        },
    },

    {
        id: "product_name",
        header: "Nombre del producto",
        cell: ({ row }) => {
            const materials = row.original.materials;
            if (!Array.isArray(materials) || materials.length === 0) {
                return row.original.product_name || "—";
            }
            return materials.map((m) => m.product_name).filter(Boolean).join(", ") || "—";
        },
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

    // Muestra si aún falta que el receptor de la firma electrónica confirme
    // el préstamo por correo (solo aparece si se pidió firma al crearlo).
    {
        id: "signature_status",
        header: "Firma",
        cell: ({ row }) => {
            const status = row.original.signature_status;
            if (!status) return "—";
            if (status === "Pendiente") {
                return (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                        Pendiente de aceptación
                    </span>
                );
            }
            return (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                    Aceptado
                </span>
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
