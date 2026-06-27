import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CircleAlert, CheckCircle } from "lucide-react";
import logoSena from "@/assets/images/logoSena.png";
import { Input, Button } from "@/shared";
import Modal from "@/shared/components/Modal";

const FORM_STATE = {
    IDLE: "idle",
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
};

function LoadingSpinner() {
    return (
        <span className="flex items-center gap-2">
            <svg
                className="animate-spin w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
            </svg>
            Enviando...
        </span>
    );
}

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [formState, setFormState] = useState(FORM_STATE.IDLE);
    const [serverError, setServerError] = useState("");

    const isLoading = formState === FORM_STATE.LOADING;
    const isSuccess = formState === FORM_STATE.SUCCESS;

    const validateEmail = (value) => {
        if (!value.trim()) return "El correo electrónico es requerido";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Ingresa un correo electrónico válido";
        return "";
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (emailError) setEmailError(validateEmail(value));
        if (serverError) setServerError("");
    };

    const handleSubmit = async () => {
        const error = validateEmail(email);
        if (error) {
            setEmailError(error);
            return;
        }

        setFormState(FORM_STATE.LOADING);
        setServerError("");

        try {
            await new Promise((resolve) => setTimeout(resolve, 1800));
            setFormState(FORM_STATE.SUCCESS);
            setOpenModal(false);
        } catch (err) {
            setFormState(FORM_STATE.ERROR);
            setServerError(
                err?.message || "No se pudo enviar el correo. Verifica tu conexión e intenta de nuevo."
            );
        }
    };

    const handleReset = () => {
        setEmail("");
        setEmailError("");
        setServerError("");
        setFormState(FORM_STATE.IDLE);
    };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background:
                    "linear-gradient(to bottom, var(--color-primary-950) 72%, var(--color-tertiary-950) 100%)",
            }}
        >
            {/* Header */}
            <header className="flex items-center gap-4 px-10 py-5">
                <img src={logoSena} alt="Logo SENA" className="h-14" />
                <h1 className="text-white text-xl font-bold leading-tight">
                    Sistema Inventario de Infraestructura y Teleinformática CDITI
                </h1>
            </header>

            {/* Contenido centrado */}
            <main className="flex flex-1 items-center justify-center pb-16 px-4">
                <div className="w-full max-w-sm">
                    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">

                        {/* Ícono decorativo */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                                <Mail className="w-7 h-7 text-green-700" aria-hidden="true" />
                            </div>
                            <h2 className="text-center text-lg font-bold text-gray-800 tracking-wide">
                                RECUPERAR CONTRASEÑA
                            </h2>
                        </div>

                        <p className="text-center text-sm text-gray-500 leading-relaxed">
                            Ingresa tu correo electrónico y te enviaremos un enlace para
                            restablecer tu contraseña.
                        </p>

                        {/* Banner de éxito */}
                        {isSuccess && (
                            <div
                                role="alert"
                                aria-live="polite"
                                className="flex flex-col gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-4"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0" aria-hidden="true" />
                                    <p className="text-sm font-semibold text-green-800">
                                        ¡Enlace enviado exitosamente!
                                    </p>
                                </div>
                                <p className="text-xs text-green-700 leading-relaxed pl-7">
                                    Si el correo <span className="font-medium">{email}</span> está
                                    registrado, recibirás el enlace en los próximos minutos. Revisa
                                    también tu carpeta de spam.
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="self-start pl-7 text-xs text-green-700 underline underline-offset-2 hover:text-green-900 transition-colors"
                                >
                                    Intentar con otro correo
                                </button>
                            </div>
                        )}

                        {/* Botones de acción */}
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="secondary"
                                size="sm"
                                type="button"
                                onClick={() => navigate("/auth")}
                                aria-label="Volver al inicio de sesión"
                            >
                                Volver
                            </Button>

                            <Button
                                variant="primary"
                                size="md"
                                type="button"
                                onClick={() => setOpenModal(true)}
                                aria-label="Abrir formulario de recuperación"
                            >
                                Recuperar contraseña
                            </Button>
                        </div>

                        {/* Link de retorno */}
                        <button
                            onClick={() => navigate("/auth")}
                            className="flex items-center justify-center gap-1 text-xs text-green-700 hover:text-green-900 transition-colors"
                            aria-label="Volver a la pantalla de inicio de sesión"
                        >
                            <ArrowLeft className="w-3 h-3" aria-hidden="true" />
                            Volver al inicio de sesión
                        </button>
                    </div>
                </div>
            </main>

            {/* Modal */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title="Recuperar contraseña"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            size="sm"
                            type="button"
                            onClick={() => setOpenModal(false)}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading ? <LoadingSpinner /> : "Enviar"}
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col gap-4">
                    <Input
                        label="Correo electrónico"
                        name="userEmail"
                        placeholder="Ingrese su correo electrónico"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        error={emailError}
                        disabled={isLoading}
                        autoComplete="email"
                    />

                    {/* Banner de error del servidor */}
                    {formState === FORM_STATE.ERROR && serverError && (
                        <div
                            role="alert"
                            aria-live="assertive"
                            className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                        >
                            <CircleAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <p className="text-xs text-red-700 leading-relaxed">
                                {serverError}
                            </p>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}