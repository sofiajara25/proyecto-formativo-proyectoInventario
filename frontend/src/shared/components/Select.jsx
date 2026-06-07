export default function Select({
    label,
    name,
    error,
    value,
    onChange,
    options = [],
}) {


    return (
        <div className="w-[320px]">

            {label && (
                <label className={`block text-caption mb-1 text-text-secondary place-self-start ${error ? "text-red-800" : "text-text-primary"}`}>
                    {label}
                </label>
            )}

            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`
                    w-full
                    h-12
                    rounded-md
                    border
                    border-border
                    px-4

                    hover:
                    hover:border-2
                    hover:border-focus-border
                    ${error ? "border-red-800" : "text-text-primary"}
                `}
            >
                <option value="">Seleccione una opción</option>

                {options.map((opt) => (

                    <option key={opt.id} value={opt.id}>
                        {opt.label}
                    </option>

                ))}
            </select>

            {/* Feedback */}
            {error && <p className="text-caption text-red-800 place-self-start">{error}</p>}
        </div>
    )
}