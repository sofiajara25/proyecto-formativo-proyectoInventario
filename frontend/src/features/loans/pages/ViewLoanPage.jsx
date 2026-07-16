import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar, Button } from "@/shared";
import { FileText } from "lucide-react";
import { getLoanById } from "../services/loanService";

export default function ViewLoanPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loan, setLoan] = useState(null);

    useEffect(() => {
        getLoanById(id).then(setLoan).catch(console.error);
    }, [id]);

    if (!loan) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))" }}>
                <p style={{ color: "var(--color-white)", fontSize: "var(--fs-sm)" }}>
                    Préstamo no encontrado.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col"
            style={{
                background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                fontFamily: "var(--main-font)",
            }}>
            <Navbar />

            <div className="flex flex-1 items-center justify-center px-10 py-8">
                <div className="bg-white rounded-2xl flex flex-col gap-6"
                    style={{ padding: "36px 40px", width: "100%", maxWidth: "680px" }}>

                    {/* Header */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center justify-center rounded-full"
                            style={{ width: "80px", height: "80px", background: "var(--color-primary-950)", flexShrink: 0 }}>
                            {loan.photo_url ? (
                                <img
                                    src={`http://localhost:5000/${loan.photo_url}`}
                                    alt="Foto del prestamo"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <FileText size={40} color="white" />
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-lg font-bold text-gray-900">{loan.product_name}</p>
                            <p className="text-sm text-gray-500">Usuario: {loan.loan_user}</p>
                            <p className="text-sm font-bold text-primary-950">
                                Estado: {loan.status ? "Activo" : "Inactivo"}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Detalles */}
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Usuario:</strong> {loan.loan_user}</p>
                        <p><strong>Categoria:</strong> {loan.category}</p>
                        <p><strong>Material:</strong> {loan.product_name}</p>
                        <p><strong>Fecha préstamo:</strong> {loan.loan_date}</p>
                        <p><strong>Fecha devolución:</strong> {loan.return_date}</p>
                        {loan.description && (
                            <p className="col-span-2"><strong>Descripción:</strong> {loan.description}</p>
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Acciones */}
                    <div className="flex justify-end gap-4">
                        <Button variant="secondary" onClick={() => navigate(-1)}>Volver</Button>
                        <Button variant="primary" onClick={() => navigate(`/dashboard/loans/${loan.id}/edit`)}>Editar</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
