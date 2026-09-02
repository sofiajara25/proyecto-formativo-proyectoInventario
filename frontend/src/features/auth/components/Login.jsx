import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSena from "@/assets/images/logoSena.png";
import { login as loginRequest } from "../services/authService";
import { logout } from "../services/logoutSevice";
import { getMyAccess } from "../../access/services/accessService";
import { saveAccess } from "@/shared/utils/permissions";
// import { useAuth } from "@/shared/context/useAuth";
import { loginSchema } from "../schemas/loginSchema"
import {
    Input,
    Button,
} from "@/shared";


export default function Login() {
    const navigate = useNavigate();
    // const { login } = useAuth();

    const [formData, setFormData] = useState({
        userEmail: "",
        userPassword: "",
    });
    const [errors, setErrors] = useState({});
    // Cuando el backend rechaza el login por sesión activa en otro lado,
    // se guarda el mensaje acá para poder mostrar el botón de "forzar
    // cierre" debajo del error, en vez de un simple alert().
    const [activeSessionError, setActiveSessionError] = useState("");
    const [isForcingLogin, setIsForcingLogin] = useState(false);

    // Si esta pantalla se muestra teniendo todavía un token guardado (por
    // ejemplo, usando las flechas atrás/adelante del navegador para volver
    // al login sin haber dado clic en "Cerrar sesión"), esa sesión queda
    // cerrada de verdad en ese mismo momento: local y en la base de datos.
    // Así, llegar al login por cualquier camino significa quedar deslogueado.
    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            logout();
        }
    }, []);

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

    // Hace el login de verdad (llamada al backend + guardar token/acceso +
    // redirigir). Se usa tanto en el submit normal como al forzar el
    // cierre de una sesión activa en otro lado.
    const performLogin = async (validData, { force = false } = {}) => {
        try {
            const data = await loginRequest(validData, { force });

            // Guarda el token de forma centralizada (sessionStorage + avisa
            // al resto de la app vía AuthContext)
            sessionStorage.setItem("token", data.token); // clave

            // Consultamos y guardamos los permisos del usuario para que
            // el menú y las rutas sepan qué módulos puede ver/usar.
            // Si esto falla, dejamos seguir el login pero sin permisos
            // (por seguridad, el usuario simplemente no verá módulos extra).
            try {
                const access = await getMyAccess();
                saveAccess(access);
            } catch (accessError) {
                console.error("No se pudo obtener el acceso del usuario:", accessError);
                saveAccess({ userType: null, isAdmin: false, permissions: [] });
            }

            navigate("/dashboard/home");
        } catch (error) {
            if (error.code === "ACTIVE_SESSION") {
                setActiveSessionError(error.message);
                return;
            }
            alert(error.message);
        }
    };

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
        setActiveSessionError("");
        await performLogin(result.data);
    };

    // Botón que aparece cuando el login se rechazó por sesión activa: pide
    // los mismos datos otra vez, pero con force para que el backend cierre
    // la sesión anterior y deje entrar de todas formas.
    const handleForceLogin = async () => {
        const result = loginSchema.safeParse(formData);
        if (!result.success) return;

        setIsForcingLogin(true);
        try {
            await performLogin(result.data, { force: true });
        } finally {
            setIsForcingLogin(false);
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

                        {/* Aviso fijo: como la contraseña de una cuenta nueva
                            se genera sola y nadie la conoce (ni siquiera
                            quien la creó), la única forma de entrar la
                            primera vez es crear una contraseña propia desde
                            "Recuperar contraseña". */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800 text-center">
                            ¿Te acaban de crear la cuenta? Ve a{" "}
                            <a
                                onClick={() => navigate("/auth/recovery")}
                                className="underline cursor-pointer font-semibold"
                            >
                                Recuperar contraseña
                            </a>{" "}
                            para crear tu contraseña y poder ingresar.
                        </div>

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
                            label="Contreseña"
                            name="userPassword"
                            placeholder="Ingrese su contraseña"
                            type="password"
                            value={formData.userPassword}
                            onChange={handleChange}
                            error={errors.userPassword}
                        />
                        {/* Olvidaste contraseña */}
                        <a
                            onClick={() => navigate("/auth/recovery")}
                            className="text-center text-xs text-green-700 cursor-pointer underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </a>

                        {/* Aviso de sesión activa en otro lado, con opción
                            de cerrarla a la fuerza para poder entrar aquí. */}
                        {activeSessionError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 text-center flex flex-col gap-2">
                                <span>{activeSessionError}</span>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleForceLogin}
                                    disabled={isForcingLogin}
                                >
                                    {isForcingLogin ? "Cerrando la otra sesión..." : "Cerrar la otra sesión e iniciar aquí"}
                                </Button>
                            </div>
                        )}

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