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
                <label className={`block text-[10px] mb-1 text-text-secondary place-self-start ${error ? "text-red-800" : "text-text-primary"}`}>
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
                    bg-white
                    text-text-primary
                    px-4

                    hover:border-focus-border
                    focus:outline-none 
                    focus:ring-1 
                    focus:ring-focus-ring
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