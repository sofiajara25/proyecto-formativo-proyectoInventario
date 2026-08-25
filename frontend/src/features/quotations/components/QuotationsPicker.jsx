import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Checkbox, FileViewer } from "@/shared";
import { getQuotations } from "../services/quotationService";

// Selector de cotizaciones YA existentes (no sube PDFs nuevos, solo elige
// del catálogo creado en el módulo de Cotizaciones). Se usa en los
// formularios de material de consumo y devolutivo.
//
// Se ve y se comporta como un <select>: cerrado por defecto (para no
// ocupar tanto espacio en el formulario), y al abrirlo muestra la lista
// con checkboxes (para poder elegir varias) + preview del PDF.
export default function QuotationsPicker({ value = [], onChange, max = 3, error }) {
    const [quotations, setQuotations] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        getQuotations()
            .then(setQuotations)
            .catch((err) => console.error("Error cargando cotizaciones:", err));
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedIds = value.map(String);

    const toggle = (id) => {
        const idStr = String(id);
        if (selectedIds.includes(idStr)) {
            onChange(value.filter((v) => String(v) !== idStr));
        } else {
            if (selectedIds.length >= max) return;
            onChange([...value, id]);
        }
    };

    const selectedNames = quotations
        .filter((q) => selectedIds.includes(String(q.quotation_id)))
        .map((q) => q.quotation_name);

    const summaryText =
        selectedNames.length === 0
            ? "Selecciona cotizaciones"
            : selectedNames.length === 1
                ? selectedNames[0]
                : `${selectedNames.length} cotizaciones seleccionadas`;

    return (
        <div className="w-full max-w-[320px]" ref={containerRef}>
            <label
                className={`
                    block text-[10px] mb-1 place-self-start
                    ${error ? "text-red-800" : "text-text-primary"}
                `}
            >
                Cotizaciones <span style={{ color: "red" }}>*</span>
            </label>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`
                        w-full h-12 rounded-md border px-4 text-base text-left
                        flex items-center justify-between gap-2
                        hover:border-2 hover:border-focus-border
                        focus:outline-none focus:ring-1 focus:ring-focus-ring
                        ${error ? "border-red-600" : "border border-border"}
                        ${selectedNames.length === 0 ? "text-gray-400" : "text-text-primary"}
                    `}
                >
                    <span className="truncate">{summaryText}</span>
                    <ChevronDown size={16} className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-white border rounded-md shadow-lg max-h-56 overflow-y-auto">
                        {quotations.length === 0 ? (
                            <p className="text-xs text-gray-500 p-3">
                                No hay cotizaciones registradas. Créalas primero en el módulo de Cotizaciones.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-1 p-2">
                                {quotations.map((q) => {
                                    const checked = selectedIds.includes(String(q.quotation_id));
                                    return (
                                        <div key={q.quotation_id} className="flex items-center justify-between gap-2 px-1 py-1 rounded hover:bg-gray-50">
                                            <Checkbox
                                                id={`quotation-${q.quotation_id}`}
                                                label={q.quotation_name}
                                                checked={checked}
                                                disabled={!checked && selectedIds.length >= max}
                                                onChange={() => toggle(q.quotation_id)}
                                            />
                                            <FileViewer file={q.pdf_url} label={q.quotation_name} size={32} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-400 mt-1">Elige entre 1 y {max} cotizaciones existentes</p>

            {error && <span className="text-red-500 text-sm block">{error}</span>}
        </div>
    );
}
