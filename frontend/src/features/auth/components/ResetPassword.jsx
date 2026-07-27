import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoSena from "@/assets/images/logoSena.png";
import { resetPassword } from "../services/passwordRecoveryService";
import { resetPasswordSchema } from "../schemas/passwordRecoveryService";
import {
    Input,
    Button,
} from "@/shared";

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const resetToken = location.state?.resetToken;

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
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

        const result = resetPasswordSchema.safeParse(formData);

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
            await resetPassword({ resetToken, newPassword: result.data.newPassword });
            alert("Contraseña actualizada correctamente. Ya puedes iniciar sesión.");
            navigate("/auth");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!resetToken) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-gray-700">
                    Tu sesión de recuperación no es válida o expiró.
                </p>
                <Button variant="primary" size="md" onClick={() => navigate("/auth/recovery")}>
                    Solicitar código
                </Button>
            </div>
        );
    }

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
                            NUEVA CONTRASEÑA
                        </h2>

                        <Input
                            label="Nueva contraseña"
                            name="newPassword"
                            placeholder="Ingrese su nueva contraseña"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            error={errors.newPassword}
                        />

                        <Input
                            label="Confirmar contraseña"
                            name="confirmPassword"
                            placeholder="Repita su nueva contraseña"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
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
                                {loading ? "Guardando..." : "Cambiar contraseña"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
