import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// Select "buscable": se ve y se comporta como el <select> de siempre, pero
// al abrirlo aparece un campo de texto arriba de las opciones para
// filtrarlas por nombre. Como es un componente compartido, cualquier
// pantalla que use <Select> lo obtiene automáticamente, sin tener que
// agregar el filtro por su cuenta en cada formulario.
//
// onChange se sigue llamando igual que con un <select> nativo, con un
// objeto { target: { name, value } }, para no tener que tocar los
// formularios que ya lo usan (algunos leen e.target.value/e.target.name).
export default function Select({
    label,
    name,
    error,
    value,
    onChange,
    options = [],
    disabled = false,
    placeholder = "Selecciona una opción",
    // Igual que antes: por defecto conserva el ancho fijo de siempre, pero
    // un formulario puntual puede pasar containerClassName="w-full" para
    // que ocupe el ancho real de su columna dentro de una grilla responsiva.
    // Máximo 320px, pero se encoge si el espacio disponible es menor.
    containerClassName = "w-full max-w-[320px]",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef(null);
    const searchInputRef = useRef(null);

    // Igual que el <select> anterior: si la opción trae "id", ese es el
    // valor real que se guarda (para no cambiar el comportamiento de las
    // pantallas que ya pasan { id, label } en vez de { value, label }).
    const normalizedOptions = useMemo(
        () =>
            options.map((opt) => ({
                value: String(opt.id ?? opt.value ?? ""),
                label: opt.label ?? "",
            })),
        [options]
    );

    const selectedOption = normalizedOptions.find(
        (opt) => opt.value === String(value ?? "")
    );

    const filteredOptions = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return normalizedOptions;
        return normalizedOptions.filter((opt) =>
            opt.label.toLowerCase().includes(term)
        );
    }, [normalizedOptions, search]);

    // Cierra el desplegable al hacer click afuera.
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const openDropdown = () => {
        if (disabled) return;
        setIsOpen(true);
        // Espera a que el input de búsqueda ya esté en el DOM.
        setTimeout(() => searchInputRef.current?.focus(), 0);
    };

    const handleSelect = (optionValue) => {
        onChange?.({ target: { name, value: optionValue } });
        setIsOpen(false);
        setSearch("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            setSearch("");
        } else if (e.key === "Enter" && filteredOptions.length === 1) {
            handleSelect(filteredOptions[0].value);
        }
    };

    return (
        <div className={containerClassName} ref={wrapperRef}>
            {label && (
                <label className={`block text-[10px] mb-1 text-text-secondary place-self-start ${error ? "text-red-800" : "text-text-primary"}`}>
                    {label}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
                    disabled={disabled}
                    className={`
                        w-full
                        h-12
                        rounded-md
                        border
                        bg-white
                        text-text-primary
                        px-4
                        flex items-center justify-between gap-2
                        text-left
                        hover:border-focus-border
                        focus:outline-none
                        focus:ring-1
                        focus:ring-focus-ring
                        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
                        ${error ? "border-red-800" : "border-border"}
                    `}
                >
                    <span className={`truncate ${selectedOption?.label ? "" : "text-gray-400"}`}>
                        {selectedOption?.label || placeholder}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {isOpen && !disabled && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-border rounded-md shadow-lg overflow-hidden">
                        <div className="p-2 border-b border-border">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Buscar..."
                                className="w-full h-9 rounded-md border border-border px-3 text-sm outline-none focus:ring-1 focus:ring-focus-ring"
                            />
                        </div>

                        <ul className="max-h-56 overflow-y-auto">
                            {filteredOptions.length === 0 && (
                                <li className="px-4 py-2 text-sm text-gray-400">
                                    Sin resultados
                                </li>
                            )}

                            {filteredOptions.map((opt) => (
                                <li key={opt.value}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(opt.value)}
                                        className={`
                                            w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                                            ${opt.value === String(value ?? "") ? "bg-gray-100 font-semibold" : ""}
                                        `}
                                    >
                                        {opt.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Feedback */}
            {error && <p className="text-caption text-red-800 place-self-start">{error}</p>}
        </div>
    );
}
