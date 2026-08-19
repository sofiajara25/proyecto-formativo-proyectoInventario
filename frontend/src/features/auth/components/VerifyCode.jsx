import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoSena from "@/assets/images/logoSena.png";
import { verifyResetCode, forgotPassword } from "../services/passwordRecoveryService";
import { verifyCodeSchema } from "../schemas/passwordRecoveryService";
import {
    Input,
    Button,
} from "@/shared";

export default function VerifyCode() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);

    const handleChange = (e) => {
        // Solo permitimos dígitos y máximo 6 caracteres
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setCode(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = verifyCodeSchema.safeParse({ code });

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        setError("");
        setLoading(true);

        try {
            const data = await verifyResetCode({ userEmail: email, code: result.data.code });

            navigate("/auth/recovery/reset", {
                state: { resetToken: data.resetToken },
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setResent(false);

        try {
            await forgotPassword(email);
            setResent(true);
        } catch (err) {
            alert(err.message);
        } finally {
            setResending(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-gray-700">
                    No hay una solicitud de recuperación en curso.
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
                <div className="bg-white rounded-2xl p-10 w-96 flex flex-col gap-5 shadow-lg">
                    <h2 className="text-center text-lg font-bold text-gray-800 tracking-wide">
                        VERIFICAR CÓDIGO
                    </h2>

                    <p className="text-center text-xs text-gray-500 -mt-2">
                        Enviamos un código de 6 dígitos a <strong>{email}</strong>. Ingrésalo para continuar.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center">
                        <Input
                            label="Código de verificación"
                            name="code"
                            placeholder="000000"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={code}
                            onChange={handleChange}
                            error={error}
                            inputClassName="text-center tracking-[0.5em] font-bold"
                        />

                        <Button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="text-xs text-green-700 underline cursor-pointer disabled:opacity-50"
                        >
                            {resending ? "Reenviando..." : "Reenviar código"}
                        </Button>

                        {resent && (
                            <p className="text-xs text-green-700 -mt-3">
                                Código reenviado, revisa tu correo.
                            </p>
                        )}

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
                                {loading ? "Verificando..." : "Verificar"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}