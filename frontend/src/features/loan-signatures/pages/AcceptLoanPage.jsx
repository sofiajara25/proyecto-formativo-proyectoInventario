import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/shared";
import { getLoanSignature, acceptLoanSignature } from "../services/loanSignatureService";

// Página PÚBLICA (sin login): a esta se llega desde el enlace del correo,
// y quien firma puede no tener cuenta en el sistema.
export default function AcceptLoanPage() {
    const { token } = useParams();
    const [signature, setSignature] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [accepting, setAccepting] = useState(false);

    useEffect(() => {
        getLoanSignature(token)
            .then(setSignature)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    const handleAccept = async () => {
        setAccepting(true);
        try {
            const response = await acceptLoanSignature(token);
            setSignature((prev) => ({ ...prev, ...response.signature }));
        } catch (err) {
            alert(err.message);
        } finally {
            setAccepting(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                fontFamily: "var(--main-font)",
            }}
        >
            <div className="bg-white rounded-2xl w-full max-w-md p-8 flex flex-col gap-4">
                {loading ? (
                    <p className="text-center text-gray-500">Cargando...</p>
                ) : error ? (
                    <p className="text-center text-red-600">{error}</p>
                ) : (
                    <>
                        <h1 className="text-xl font-bold" style={{ color: "var(--color-primary-950)" }}>
                            Confirmación de préstamo
                        </h1>

                        <div className="flex flex-col gap-1 text-sm">
                            <p><strong>Usuario:</strong> {signature.loan_user}</p>
                            <p><strong>Fecha de préstamo:</strong> {signature.loan_date?.slice(0, 10)}</p>
                            <p><strong>Fecha de devolución:</strong> {signature.return_date?.slice(0, 10)}</p>
                            <div>
                                <strong>Materiales:</strong>
                                <ul className="list-disc list-inside">
                                    {(signature.materials ?? []).map((m, i) => (
                                        <li key={i}>{m.product_name} (x{m.quantity})</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {signature.status === "Aceptado" ? (
                            <p className="text-center text-green-700 font-semibold">
                                Ya aceptaste este préstamo el {new Date(signature.accepted_at).toLocaleString("es-CO")}.
                            </p>
                        ) : (
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleAccept}
                                disabled={accepting}
                            >
                                {accepting ? "Enviando..." : "Acepto este préstamo"}
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
