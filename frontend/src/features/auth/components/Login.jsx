import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSena from "@/assets/images/LogoSena.png";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(to bottom, var(--color-primary-950) 72%, var(--color-tertiary-950) 100%)" }}>
            
            {/* Header */}
            <div className="flex items-center gap-4 px-10 py-5">
                <img src={logoSena} alt="Logo SENA" className="h-14" />
                <h1 className="text-white text-xl font-bold">
                    Sistema Inventario de Infraestructura y Teleinformática CDITI
                </h1>
            </div>

            {/* Contenido */}
            <div className="flex flex-1 items-center justify-center pb-16">
                <div className="bg-white rounded-2xl p-10 w-96 flex flex-col gap-5 shadow-lg">
                    
                    <h2 className="text-center text-lg font-bold text-gray-800 tracking-wide">
                        INICIAR SESIÓN
                    </h2>

                    {/* Correo */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                            Correo
                        </label>
                        <input
                            type="email"
                            value={email}
                            placeholder="correo@ejemplo.com"
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none focus:border-green-600 focus:bg-green-50"
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none focus:border-green-600 focus:bg-green-50"
                        />
                    </div>

                    {/* Olvidaste contraseña */}
                    <p
                        onClick={() => navigate("/auth/recovery")}
                        className="text-right text-xs text-green-700 cursor-pointer underline"
                    >
                        ¿Olvidaste tu contraseña?
                    </p>

                        {/* Botones */}
                        <button
                        onClick={() => navigate("/dashboard/home")}
                        className="w-full rounded-full py-3 text-sm font-bold text-white cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all"
                        style={{ background: "var(--color-primary-950)" }}
                    >
                        Iniciar Sesión
                    </button>

                    <button
                        onClick={() => navigate("/auth/register")}
                        className="w-full rounded-full py-3 text-sm font-bold cursor-pointer border-2 hover:opacity-80 hover:scale-[1.02] transition-all"
                        style={{ color: "var(--color-tertiary-950)", borderColor: "var(--color-tertiary-950)", background: "transparent" }}
                    >
                        Registrarse
                    </button>

                </div>
            </div>
        </div>
    );
}