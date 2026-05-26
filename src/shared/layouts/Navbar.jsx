import { Menu, ArrowLeft, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
    IconButton,
    Dropdown,
    DropdownTrigger,
    DropdownItem,
    DropdownContent,
    SearchField,
} from "@/shared";
import logoSena from "@/assets/images/LogoSena.png";
import { useState } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const handleSearch = (value) => console.log("Buscar:", value);
    const handleClear = () => console.log("Campo limpiado");

    return (
        <nav className="w-full" style={{ fontFamily: "var(--main-font)" }}>
            <div className="px-2">
                <div className="flex h-16 items-center gap-2">

                    {/* Izquierda: menú + volver */}
                    <div className="flex items-center gap-1 text-text-inverse">
                        <Dropdown>
                            <DropdownTrigger>
                                <IconButton ariaLabel="Menú">
                                    <Menu />
                                </IconButton>
                            </DropdownTrigger>

                            <DropdownContent className="w-48">
                                <DropdownItem>
                            <Link to="/dashboard/auth" className="block w-full"
                                style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}>
                                Inicio
                            </Link>
                        </DropdownItem>
                        <DropdownItem>
                            <Link to="/dashboard" className="block w-full"
                                style={{ fontSize: "var(--fs-xxs)", color: "var(--color-white)" }}>
                                Reportes
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

                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer"
                            style={{ background: "transparent", border: "none" }}
                        >
                            <ArrowLeft size={24} style={{ color: "var(--color-gray-950)" }} />
                        </button>
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
                        <button
                            onClick={() => navigate("/auth")}
                            className="cursor-pointer rounded-lg px-4 py-2"
                            style={{
                                background: "var(--color-tertiary-950)",
                                color: "var(--color-white)",
                                fontSize: "var(--fs-xxs)",
                                fontWeight: "var(--font-weight-regular)",
                                border: "none",
                                fontFamily: "var(--main-font)",
                            }}
                        >
                            Cerrar sesión
                        </button>

                        <div className="hidden sm:block">
                            <Link to="/dashboard/home">
                                <img src={logoSena} alt="logo" className="h-12 w-auto" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
}