import { FileViewer } from "@/shared";
import QuotationStatusSwitch from "./QuotationStatusSwitch";

// Tarjeta simple: solo mostrar, previsualizar y activar/desactivar (no hay
// editar — si se subió mal el PDF se crea una cotización nueva).
export default function QuotationCard({ quotation }) {
    return (
        <div
            className="bg-white rounded-2xl flex items-center gap-3 transition-transform hover:scale-[1.02]"
            style={{
                border: "1px solid var(--color-gray-100)",
                padding: "14px 16px",
                fontFamily: "var(--main-font)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
        >
            <FileViewer file={quotation.pdf_url} label={quotation.quotation_name} size={64} />
            <div className="flex flex-col gap-1 min-w-0 flex-1">
                <p
                    className="font-heading text-sm font-semibold truncate"
                    style={{ color: "var(--color-primary-950)" }}
                >
                    {quotation.quotation_name}
                </p>
                <p className="text-xs text-gray-400">PDF</p>
                <QuotationStatusSwitch quotation={quotation} />
            </div>
        </div>
    );
}
