import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSena from "@/assets/images/logoSena.png";
import { login } from "../services/authService";
import { loginSchema } from "../schemas/loginSchema"
import {
    Input,
    Button,
} from "@/shared";


export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userEmail: "",
        userPassword: "",
    });
    const [errors, setErrors] = useState({});

    // ======================================
    //            Handle Genérico
    // ======================================
    /**
     * Función que se ejecuta cada vez que cambia el valor de un input del formulario
     */
    const handleChange = (e) => {
        // Se obtiene el nombre del campo y su valor
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            // Se copian todos los valores anteriores del estado
            ...prev,

            // Se actualiza unicamente lo que cambió
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ======================================
    //            Handle Submit
    // ======================================
    /**
     * Función que se ejecuta cuando se envía el formulario
     */

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            // Objeto donde se almacenarán
            const fieldErrors = {};

            // Zod devuelve los errores en un arreglo llamado issues
            // Se recorren para asociar cada error a su campo correspondiente
            result.error.issues.forEach((issue) => {
                // contiene la ruta del campo que falló
                // Se guarda el mensaje de error en el objeto
                fieldErrors[issue.path[0]] = issue.message;
            });

            setErrors(fieldErrors);
            // Se detiene la ejecución porque el formulario tiene errores
            return;
        }

        setErrors({});

        try {
            const data = await login(result.data);

            sessionStorage.setItem("token", data.token); // clave 

            // navigate("/"); // o dashboard
            navigate("/dashboard/home");
        } catch (error) {
            alert(error.message);
        }
    };

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
                <form onSubmit={handleSubmit} className="grid grid-cols-1 place-items-center gap-6">
                    <div className="bg-white rounded-2xl p-10 w-96 flex flex-col gap-5 shadow-lg">
                        <h2 className="text-center text-lg font-bold text-gray-800 tracking-wide">
                            INICIAR SESIÓN
                        </h2>

                        <Input
                            label="Email"
                            name="userEmail"
                            placeholder="Ingrese el correo"
                            type="email"
                            value={formData.userEmail}
                            onChange={handleChange}
                            error={errors.userEmail}
                        />

                        <Input
                            label="Contraseña"
                            name="userPassword"
                            placeholder="Ingrese su contraseña"
                            type="password"
                            value={formData.userPassword}
                            onChange={handleChange}
                            error={errors.userPassword}
                        />
                        {/* Olvidaste contraseña */}
                        <a
                            onClick={() => navigate("recovery")}
                            className="text-right text-xs text-green-700 cursor-pointer underline place-self-center"
                        >
                            ¿Olvidaste tu contraseña?
                        </a>

                        {/* Actions */}
                        <div className="flex items-center justify-center gap-12">

                            <Button variant="primary" size="md" type="submit">
                                Iniciar
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div >
    );
}