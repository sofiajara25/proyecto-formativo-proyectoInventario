import { SquarePen, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoanRowActions({ loan }) {
    const navigate = useNavigate();

    // Acción para editar el préstamo
    const handleEdit = () => {
        navigate(`/dashboard/loans/${loan.id}/edit`);
    };

    // Acción para ver el préstamo
    const handleView = () => {
        navigate(`/dashboard/loans/${loan.id}/view`);
    };

    return (
        <div className="flex gap-2">
            {/* Botón ver */}
            <button
                onClick={handleView}
                className="p-1 rounded hover:bg-gray-100"
            >
                <Eye size={18} color="#083344" />
            </button>

            {/* Botón editar */}
            <button
                onClick={handleEdit}
                className="p-1 rounded hover:bg-gray-100"
            >
                <SquarePen size={16} color="#71277A" />
            </button>
        </div>
    );
}
