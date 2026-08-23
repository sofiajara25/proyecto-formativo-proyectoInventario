export default function Select({
    label,
    name,
    error,
    value,
    onChange,
    options = [],
    disabled = false,
    // Igual que en Input.jsx: por defecto conserva el ancho fijo de siempre
    // (para no afectar los demás formularios), pero un formulario puntual
    // puede pasar, por ejemplo, containerClassName="w-full" para que ocupe
    // el ancho real de su columna dentro de una grilla responsiva.
    // Igual que en Input.jsx: máximo 320px, pero se encoge si el espacio
    // disponible es menor, en vez de desbordarse en pantallas angostas.
    containerClassName = "w-full max-w-[320px]",
}) {

    return (
        <div className={containerClassName}>

            {label && (
                <label className={`block text-[10px] mb-1 text-text-secondary place-self-start ${error ? "text-red-800" : "text-text-primary"}`}>
                    {label}
                </label>
            )}

            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`
                    w-full
                    h-12
                    rounded-md
                    border
                    bg-white
                    text-text-primary
                    px-4

                    hover:border-focus-border
                    focus:outline-none
                    focus:ring-1
                    focus:ring-focus-ring
                    ${disabled ? "opacity-60 cursor-not-allowed" : ""}
                    ${error ? "border-red-800" : "border-border"}
                `}
            >
                {options.map((opt) => {
                    const key = opt.id ?? opt.value;
                    return (
                        <option key={key} value={key}>
                            {opt.label}
                        </option>
                    );
                })}

            </select>

            {/* Feedback */}
            {error && <p className="text-caption text-red-800 place-self-start">{error}</p>}
        </div>
    )
}