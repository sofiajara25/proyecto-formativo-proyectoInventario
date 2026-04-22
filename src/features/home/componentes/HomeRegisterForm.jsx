import { useState } from "react";

export default function HomeRegisterForm() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errors, setErrors] = useState({});

const validate = () => {
    const e = {};
    if (!email.includes("@")) e.email = "Correo inválido";
    if (password.length < 6) e.password = "Mínimo 6 caracteres";
    return e;
};

const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) console.log("Login:", { email, password });
};

return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-xl shadow w-80">
        <h2 className="text-xl font-semibold mb-6 text-center">Iniciar sesión</h2>

        <div className="mb-3">
        <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400 ${errors.email ? "border-red-400" : ""}`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="mb-5">
        <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400 ${errors.password ? "border-red-400" : ""}`}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <button
        onClick={handleSubmit}
        className="w-full bg-green-500 text-white py-2 rounded-lg text-sm hover:bg-green-600"
        >
        Entrar
        </button>
    </div>
    </div>
);
}