import { Menu, ArrowLeft, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
    IconButton,
    Dropdown,
    DropdownTrigger,
    DropdownItem,
    DropdownContent,
    SearchField,
    Button
} from "@/shared";
import logoSena from "@/assets/images/LogoSena.png";
import { useState } from "react";
import { logout } from "../../features/auth/services/logoutSevice";

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };
    const [search, setSearch] = useState("");

    const handleSearch = (value) => console.log("Buscar:", value);
    const handleClear = () => console.log("Campo limpiado");

    return (
        <nav className=" flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))" }}>
            <div className="px-2">
                <div className="flex h-16 items-center gap-2">

                    {/* Izquierda: menú + volver */}
                        <IconButton
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer"
                            style={{ background: "transparent", border: "none" }}
                        >
                            <ArrowLeft size={24} style={{ color: "white" }} />
                        </IconButton>

                    <div className="flex items-center gap-1 text-text-inverse">
                        <div className="hidden sm:block">
                            <Link to="/dashboard/home">
                                <img src={logoSena} alt="logo" className="h-12 w-auto relative left-60" />
                            </Link>
                        </div>

                    </div>

                    {/* Centro: buscador */}
                    <div className="flex-1 flex justify-center">
                        <SearchField
                            value={search}
                            onChange={setSearch}
                            onSubmit={handleSearch}
                            onClear={handleClear}
                            placeholder="Buscar productos..."
                            size="sm"
                            variant="filled"
                            className="w-full max-w-lg border-0"
                        />
                    </div>

                    {/* Derecha: cerrar sesión + logo */}
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handleLogout}
                            variant="secondary" size="sm"
                        >
                            Cerrar sesión
                        </Button>
                        <Dropdown>
                            <DropdownTrigger>
                                <IconButton ariaLabel="Menú">
                                    <Menu size={24} style={{ color: "white" }} />
                                </IconButton>
                            </DropdownTrigger>

                            <DropdownContent className="w-17 ">
                                <DropdownItem>
                                    <Link to="/dashboard/home" className="block w-full "
                                        style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}>
                                        Inicio
                                    </Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link to="/dashboard/list" className="block w-full"
                                        style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}>
                                        Listas
                                    </Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link to="/dashboard/setting" className="block w-full"
                                        style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}>
                                        Ajustes
                                    </Link>
                                </DropdownItem>
                            </DropdownContent>
                        </Dropdown>

                    </div>

                </div>
            </div>
        </nav>
    );
}