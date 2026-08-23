import { Menu, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
    IconButton,
    Dropdown,
    DropdownTrigger,
    DropdownItem,
    DropdownContent,
    SearchField,
    Button,
} from "@/shared";
import logoSena from "@/assets/images/LogoSena.png";
import { logout } from "../../features/auth/services/logoutSevice";

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    return (
        <nav
            style={{
                background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
            }}
        >
            <div className="px-3 sm:px-4">
                <div className="flex h-14 sm:h-16 items-center gap-2 justify-between">

                    {/* Izquierda: volver + logo */}
                    <div className="flex items-center shrink-0 gap-14">
                        <IconButton
                            ariaLabel="Volver"
                            variant="nav"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={24} />
                        </IconButton>

                        <Link to="/dashboard/home" className="hidden md:block ml-10">
                            <img src={logoSena} alt="logo" className="h-10 sm:h-12 w-auto" />
                        </Link>
                    </div>

                    {/* Derecha: cerrar sesión + menú */}
                    <div className="flex items-center gap-2 shrink-0 justify-end">
                        {/* Cerrar sesión — oculto en móvil, visible en sm+ */}
                        <div className="hidden sm:block">
                            <Button onClick={handleLogout} variant="secondary" size="sm">
                                Cerrar sesión
                            </Button>
                        </div>

                        <Dropdown>
                            <DropdownTrigger>
                                <IconButton ariaLabel="Menú" variant="nav">
                                    <Menu size={24} />
                                </IconButton>
                            </DropdownTrigger>

                            <DropdownContent className="w-44">
                                <DropdownItem>
                                    <Link
                                        to="/dashboard/home"
                                        className="block w-full"
                                        style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}
                                    >
                                        Inicio
                                    </Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link
                                        to="/dashboard/list"
                                        className="block w-full"
                                        style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}
                                    >
                                        Listas
                                    </Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link
                                        to="/dashboard/setting"
                                        className="block w-full"
                                        style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}
                                    >
                                        Ajustes
                                    </Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link
                                        to="/dashboard/tasks/search"
                                        className="block w-full"
                                        style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}
                                    >
                                        Buscar tareas
                                    </Link>
                                </DropdownItem>
                                {/* Cerrar sesión en móvil dentro del menú */}
                                <DropdownItem className="sm:hidden">
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left"
                                        style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}
                                    >
                                        Cerrar sesión
                                    </button>
                                </DropdownItem>
                            </DropdownContent>
                        </Dropdown>
                    </div>

                </div>
            </div>
        </nav>
    );
}