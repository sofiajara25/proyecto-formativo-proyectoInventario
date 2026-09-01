import { useState } from "react";
import { X, Plus } from "lucide-react";

// Campo para capturar varios valores de texto libre (ej. varios
// cuentadantes/custodios) como una lista de "chips" removibles, en vez de un
// solo Input. No están ligados a ninguna tabla (no son usuarios reales, solo
// texto): se escribe un nombre, se agrega, y queda en la lista.
export default function TagsInput({
    label,
    name,
    values = [],
    onChange,
    placeholder = "Escribe un nombre y presiona Enter",
    error,
    containerClassName = "",
}) {
    const [draft, setDraft] = useState("");

    const addValue = () => {
        const trimmed = draft.trim();
        if (!trimmed) return;
        onChange([...values, trimmed]);
        setDraft("");
    };

    const removeValue = (index) => {
        onChange(values.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addValue();
        }
    };

    return (
        <div className={`w-full max-w-[320px] ${containerClassName}`}>
            {label && (
                <label className={`block text-[10px] mb-1 place-self-start ${error ? "text-red-800" : "text-text-primary"}`}>
                    {label}
                </label>
            )}

            <div className="flex gap-2">
                <input
                    type="text"
                    name={name}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`
                        relative
                        w-full
                        h-12
                        rounded-md
                        border
                        px-4
                        text-base
                        hover:border-2 hover:border-focus-border
                        focus:outline-none focus:ring-1 focus:ring-focus-ring
                        ${error ? "border-red-600" : "border-border"}
                    `}
                />
                <button
                    type="button"
                    onClick={addValue}
                    aria-label="Agregar"
                    className="shrink-0 h-12 w-12 rounded-md border border-border flex items-center justify-center hover:border-focus-border focus:outline-none focus:ring-1 focus:ring-focus-ring"
                >
                    <Plus size={18} />
                </button>
            </div>

            {values.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {values.map((value, index) => (
                        <span
                            key={`${value}-${index}`}
                            className="inline-flex items-center gap-1 rounded-full bg-neutral-100 border border-gray-200 px-3 py-1 text-xs text-text-primary"
                        >
                            {value}
                            <button
                                type="button"
                                onClick={() => removeValue(index)}
                                aria-label={`Quitar ${value}`}
                                className="text-gray-400 hover:text-red-600"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {error && <p className="text-caption text-red-800 place-self-start mt-1">{error}</p>}
        </div>
    );
}
