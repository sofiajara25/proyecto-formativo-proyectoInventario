import DataTable from "@/shared/components/DataTable"
import { usersColumns } from "../table/usersColumns"
import { users } from "../data/users"
import { Button } from "@/shared"
import { useNavigate, Link } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";
// import logoSena from "@/assets/images/LogoSena.png";


export default function ListUserPage() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-600 via-green-600 to-purple-600  flex flex-col items-center justify-center">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full  py-6  text-center z-50">
                {/* Botón volver */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer"
                >
                    <CircleArrowLeft size={36} color="#ffffff" />
                </button>
                {/* Logo de marca */}
                <h1 className="text-white text-2xl font-bold">
                    Sistema Inventario de Infraestructura y <br /> Teleinformática CDITI SENA
                </h1>
            </header>

            {/* Caja */}
            <div className="mt-40 p-8 rounded-xl shadow w-full bg-white">
                <div className="flex flex-1 justify-end gap-2">
                    <Button variant="primary" size="md">
                        Reportar usuario
                    </Button>
                    <Button variant="primary" size="md" onClick={() => navigate("/dashboard/usuarios")}>
                        Crear usuario
                    </Button>
                </div>

                <h1 className="text-xl font-semibold mb-4">
                    Usuarios
                </h1>


                <DataTable
                    data={users}
                    columns={usersColumns}
                />

            </div>
        </div>
    )
}
