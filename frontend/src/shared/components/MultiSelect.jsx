import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, X } from "lucide-react";
import { useFloatingDropdown } from "../hooks/useFloatingDropdown";

// Igual que Select (desplegable con buscador), pero permite elegir VARIAS
// opciones. Las elegidas se muestran como "chips" removibles debajo.
// Se usa para campos muchos-a-muchos con llave foránea, ej. los
// cuentadantes de un material (usuarios reales de la tabla users).
//
// - options: [{ value, label }]
// - values: arreglo con los "value" elegidos
// - onChange(nuevosValues): recibe el arreglo completo actualizado
export default function MultiSelect({
    label,
    name,
    error,
    values = [],
    onChange,
    options = [],
    disabled = false,
    placeholder = "Selecciona una o varias opciones",
    emptyText = "Sin resultados",
    containerClassName = "w-full max-w-[320px]",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef(null);
    const anchorRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);
    // Igual que Select: el desplegable se dibuja en <body> para que no lo
    // recorte un contenedor con scroll.
    const { style: dropdownStyle, updatePosition } = useFloatingDropdown(anchorRef, isOpen);

    const selectedKeys = useMemo(() => new Set(values.map(String)), [values]);

    const selectedOptions = useMemo(
        () => options.filter((opt) => selectedKeys.has(String(opt.value))),
        [options, selectedKeys]
    );

    const filteredOptions = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return options;
        return options.filter((opt) => String(opt.label).toLowerCase().includes(term));
    }, [options, search]);

    // Cierra el desplegable al hacer click afuera.
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            const insideField = wrapperRef.current?.contains(e.target);
            const insideDropdown = dropdownRef.current?.contains(e.target);
            if (!insideField && !insideDropdown) {
                setIsOpen(false);
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const openDropdown = () => {
        if (disabled) return;
        updatePosition();
        setIsOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 0);
    };

    // Agrega o quita la opción, sin cerrar el desplegable (así se pueden
    // elegir varias seguidas).
    const toggleOption = (optionValue) => {
        const key = String(optionValue);
        const next = selectedKeys.has(key)
            ? values.filter((v) => String(v) !== key)
            : [...values, optionValue];
        onChange?.(next);
    };

    const removeOption = (optionValue) => {
        onChange?.(values.filter((v) => String(v) !== String(optionValue)));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            setSearch("");
        } else if (e.key === "Enter") {
            // Evita que Enter envíe el formulario del material.
            e.preventDefault();
            if (filteredOptions.length === 1) toggleOption(filteredOptions[0].value);
        }
    };

    const summary = selectedOptions.length
        ? `${selectedOptions.length} seleccionado${selectedOptions.length === 1 ? "" : "s"}`
        : placeholder;

    return (
        <div className={containerClassName} ref={wrapperRef}>
            {label && (
                <label className={`block text-[10px] mb-1 place-self-start ${error ? "text-red-800" : "text-text-primary"}`}>
                    {label}
                </label>
            )}

            <div className="relative" ref={anchorRef}>
                <button
                    type="button"
                    name={name}
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
                    <span className={`truncate ${selectedOptions.length ? "" : "text-gray-400"}`}>
                        {summary}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {isOpen && !disabled && dropdownStyle && createPortal(
                    <div
                        ref={dropdownRef}
                        style={dropdownStyle}
                        className="flex flex-col bg-white border border-border rounded-md shadow-lg overflow-hidden"
                    >
                        <div className="p-2 border-b border-border shrink-0">
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

                        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                            {filteredOptions.length === 0 && (
                                <li className="px-4 py-2 text-sm text-gray-400">{emptyText}</li>
                            )}

                            {filteredOptions.map((opt) => {
                                const isSelected = selectedKeys.has(String(opt.value));
                                return (
                                    <li key={opt.value}>
                                        <button
                                            type="button"
                                            onClick={() => toggleOption(opt.value)}
                                            className={`
                                                w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                                                flex items-center justify-between gap-2
                                                ${isSelected ? "bg-gray-100 font-semibold" : ""}
                                            `}
                                        >
                                            <span className="truncate">{opt.label}</span>
                                            {isSelected && <Check size={14} className="shrink-0 text-green-600" />}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>,
                    document.body
                )}
            </div>

            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedOptions.map((opt) => (
                        <span
                            key={opt.value}
                            className="inline-flex items-center gap-1 rounded-full bg-neutral-100 border border-gray-200 px-3 py-1 text-xs text-text-primary"
                        >
                            {opt.label}
                            <button
                                type="button"
                                onClick={() => removeOption(opt.value)}
                                aria-label={`Quitar ${opt.label}`}
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
