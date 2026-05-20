import { Search, Menu, ArrowLeft, User } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate()

    // Componente de búsqueda
    const [search, setSearch] = useState("");

    const handleSearch = (value) => {
        console.log("Buscar:", value);
    };

    const handleClear = () => {
        console.log("Campo limpiado");
    };

    return (
        <nav className="w-full bg-transparent border-b-2">
            <div className="mx-auto max-w-7xl px-4 ">
                <div className="flex h-16 items-center justify-between">

                    {/* ======= Dropdown ======= */}
                    <div className="p-10">
                        <Dropdown>
                            <DropdownTrigger>
                                <IconButton ariaLabel="Menú">
                                    <Menu />
                                </IconButton>
                            </DropdownTrigger>

                            <DropdownContent className="right-0 w-48">
                                <DropdownItem>
                                    <IconButton ariaLabel="Menú de usuario" >
                                        <User size={24} color="#ffffff"/>
                                    </IconButton>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link to="/dashboard/auth" className="block w-full">
                                        Inicio
                                    </Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link to="/dashboard" className="block w-full">
                                        Reportes
                                    </Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link to="/dashboard" className="block w-full">
                                        Listas
                                    </Link>
                                </DropdownItem>

                                <DropdownItem>
                                    <Link to="/dashboard" className="block w-full">
                                        Ajustes
                                    </Link>
                                </DropdownItem>
                            </DropdownContent>
                        </Dropdown>
                    </div>

                    {/* Botón volver */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer"
                    >
                        <ArrowLeft size={24} color="#000000" />
                    </button>

                    {/* Switch */}
                    {/* inline-flex: Ocupa solo su contenido, no todo el ancho. */}

                    {/* Sección de la derecha: búsqueda + usuario */}
                    {/* <div className="flex items-center gap-5"> */}

                    {/* Icono de búsqueda
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />

                            {/* Input */}
                    {/* <input
                                type="text"
                                placeholder="Buscar"
                                className="pl-9 pr-4 py-2.5 border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-text-primary"
                            />
                        </div> */}

                    <SearchField
                        value={search}
                        onChange={setSearch}
                        onSubmit={handleSearch}
                        onClear={handleClear}
                        placeholder="Buscar productos..."
                        size="md"
                        variant="filled"
                        className="w-76"
                    />

                    {/* Cerrar sesión */}
                    <button
                        onClick={() => navigate("/auth")}
                        className="text-sm text-white rounded-lg px-4 py-2 cursor-pointer"
                        style={{ background: "#7c3aed", border: "none" }}
                    >
                        Cerrar sesión
                    </button>
                    {/* Icono de usuario */}
                    {/* Logo de marca */}
                    <div className="hidden sm:block items-center">
                        <Link to={"/dashboard/home"} className="text-h1 font-heading ">
                            <img src={logoSena} alt="logo" className="h-12 w-auto" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
};