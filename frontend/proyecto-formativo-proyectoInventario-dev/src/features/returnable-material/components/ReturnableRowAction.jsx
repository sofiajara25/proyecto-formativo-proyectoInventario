// Iconos usados en los botones de acciones
import { SquarePen, EllipsisVertical, Eye } from "lucide-react";

import {
    Dropdown,
    DropdownTrigger,
    DropdownItem,
    DropdownContent,

} from "@/shared";

// Hook de React Router para navegar programáticamente entre rutas
import { Link, useNavigate } from "react-router-dom";


// Componente que renderiza las acciones de cada fila de usuario
// Recibe como prop el objeto user
export default function ReturnableRowAction({ retornables }) {


    // const handleEdit = () => {
    //   console.log("Editar usuario", user.id);
    // };


    // Hook que permite redirigir a otra ruta desde código
    const navigate = useNavigate();


    // Acción para editar el usuario
    // Redirige a la página de edición usando el id del usuario
    const handleEdit = () => {
        navigate(`/retornables/${retornables.id}/edit`);
    };


    // // Acción para eliminar el usuario
    // // Actualmente solo imprime en consola el id
    // // En una aplicación real aquí se llamaría a la API
    // const handleDelete = () => {
    //     console.log("Eliminar usuario", user.id);
    // };


    return (
        // Contenedor de los botones de acciones
        <div className="flex gap-2">

            {/* Botón ver */}
            <button
                onClick={handleEdit} // Ejecuta la navegación a la página de edición
                className="p-1 rounded hover:bg-gray-100"
            >
                <Eye size={18} color="#083344"/> {/* Icono de editar */}
            </button>

            {/* Botón editar */}
            <button
                onClick={handleEdit} // Ejecuta la navegación a la página de edición
                className="p-1 rounded hover:bg-gray-100"
            >
                <SquarePen size={16} color="#71277A"/> {/* Icono de editar */}
            </button>
        </div>
    );
}
