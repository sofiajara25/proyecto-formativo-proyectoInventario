import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSena from "@/assets/images/logoSena.png";
import { forgotPassword } from "../services/passwordRecoveryService";
import { forgotPasswordSchema } from "../schemas/passwordRecoveryService";
import {
    Input,
    Button,
} from "@/shared";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userEmail: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = forgotPasswordSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};

            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await forgotPassword(result.data.userEmail);

            // Pasamos el correo a la siguiente pantalla para verificar el código
            navigate("/auth/recovery/verify", {
                state: { email: result.data.userEmail },
            });
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
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
                <div className="bg-white rounded-2xl p-10 w-96 flex flex-col gap-5 shadow-lg">
                    <h2 className="text-center text-lg font-bold text-gray-800 tracking-wide">
                        RECUPERAR CONTRASEÑA
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center">
                        <p className="text-center text-xs text-gray-500 -mt-2">
                            Ingresa tu correo y te enviaremos un código de verificación para restablecer tu contraseña.
                        </p>

                        <Input
                            label="Email"
                            name="userEmail"
                            placeholder="Ingrese el correo"
                            type="email"
                            value={formData.userEmail}
                            onChange={handleChange}
                            error={errors.userEmail}
                        />

                        <div className="flex items-center justify-center gap-12">
                            <Button
                                variant="secondary"
                                size="sm"
                                type="button"
                                onClick={() => navigate("/auth")}
                            >
                                Cancelar
                            </Button>

                            <Button variant="primary" size="md" type="submit" disabled={loading}>
                                {loading ? "Enviando..." : "Enviar código"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}