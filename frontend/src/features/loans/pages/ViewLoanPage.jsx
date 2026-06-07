import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/shared";
import { FileText } from "lucide-react";
import { loans } from "../data/loans";

export default function ViewLoanPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const loan = loans.find((l) => l.id === Number(id));

    if (!loan) return (
        <div className="min-h-screen flex items-center justify-center"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))" }}>
            <p style={{ color: "var(--color-white)", fontSize: "var(--fs-sm)" }}>Préstamo no encontrado.</p>
        </div>
    );

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                fontFamily: "var(--main-font)",
            }}
            onClick={() => navigate("/dashboard/list-prestamo")}
        >
            <Navbar />

            <div
                className="flex flex-1 items-center justify-center px-10 py-8"
                onClick={() => navigate("/dashboard/list-prestamo")}
            >
                <div
                    className="bg-white rounded-2xl flex flex-col gap-6"
                    style={{ padding: "36px 40px", width: "100%", maxWidth: "680px" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center gap-6">
                        <div
                            className="flex items-center justify-center rounded-full"
                            style={{ width: "80px", height: "80px", background: "var(--color-primary-950)", flexShrink: 0 }}
                        >
                            <FileText size={40} color="white" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <p style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--font-weight-bold)", color: "var(--color-gray-900)", margin: 0 }}>
                                {loan.materialName}
                            </p>
                            <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-gray-500)", margin: 0 }}>
                                {loan.user}
                            </p>
                            <p style={{ fontSize: "var(--fs-xxs)", fontWeight: "var(--font-weight-bold)", color: "var(--color-primary-950)", margin: 0 }}>
                                {loan.category}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Detalles */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Usuario", value: loan.user },
                            { label: "Categoría", value: loan.category },
                            { label: "Nombre del material", value: loan.materialName },
                            { label: "Fecha de préstamo", value: loan.loanDate },
                            { label: "Fecha de devolución", value: loan.returnDate },
                            { label: "Descripción", value: loan.description },
                        ].map((item) => (
                            <div key={item.label} className="flex flex-col gap-1">
                                <p style={{ fontSize: "var(--fs-xxxs)", fontWeight: "var(--font-weight-bold)", color: "var(--color-gray-500)", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    {item.label}
                                </p>
                                <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-gray-900)", margin: 0 }}>
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1.5px solid var(--color-gray-100)" }} />

                    {/* Acciones */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => navigate("/dashboard/loans/${loan.id}/edit")}
                            className="rounded-full px-6 py-2 cursor-pointer transition-all"
                            style={{
                                background: "var(--color-primary-950)",
                                color: "var(--color-white)",
                                fontSize: "var(--fs-xxs)",
                                fontWeight: "var(--font-weight-bold)",
                                border: "none",
                                fontFamily: "var(--main-font)",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-700)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-primary-950)"}
                        >
                            Editar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}