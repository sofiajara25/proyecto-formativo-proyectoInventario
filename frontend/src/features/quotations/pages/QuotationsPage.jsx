import { useEffect, useState } from "react";
import { Navbar, Button } from "@/shared";
import { getQuotations } from "../services/quotationService";
import QuotationsRegisterForm from "../components/QuotationsRegisterForm";
import QuotationCard from "../components/QuotationCard";

export default function QuotationsPage() {
    const [quotations, setQuotations] = useState([]);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    useEffect(() => {
        getQuotations()
            .then(setQuotations)
            .catch((err) => console.error("Error al cargar cotizaciones:", err));
    }, []);

    const handleCreated = (quotation) => {
        setQuotations((prev) => [quotation, ...prev]);
    };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                fontFamily: "var(--main-font)",
            }}
        >
            <Navbar />

            <div>
                <h2 className="text-2xl font-medium text-center text-white">
                    Cotizaciones
                </h2>
            </div>

            <main className="flex-1 flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex justify-center">
                    <Button variant="primary" size="md" onClick={() => setIsRegisterOpen(true)}>
                        Crear cotización
                    </Button>
                </div>

                <div className="flex-1 bg-white rounded-xl shadow-lg p-5 min-h-[300px]">
                    {quotations.length === 0 ? (
                        <p
                            className="text-sm text-center mt-10"
                            style={{ color: "var(--color-tertiary-950)", fontFamily: "var(--main-font)" }}
                        >
                            Aún no hay cotizaciones registradas.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quotations.map((quotation) => (
                                <QuotationCard key={quotation.quotation_id} quotation={quotation} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {isRegisterOpen && (
                <QuotationsRegisterForm
                    onClose={() => setIsRegisterOpen(false)}
                    onCreated={handleCreated}
                />
            )}
        </div>
    );
}
