export default function Input({
    label,
    type = "text",
    error,
    containerClassName = "",
    labelClassName = "",
    inputClassName = "",
    ...props
}) {
    return (
        <div className={`w-[320px] ${containerClassName}`}>
            {label && (
                <label
                    className={`
                        block
                        text-[8px]
                        mb-1
                        place-self-start
                        ${error ? "text-red-800" : "text-text-primary"}
                        ${labelClassName}
                    `}
                >
                    {label}
                </label>
            )}

            <div className="relative h-12 flex items-center">
                <div
                    className="absolute inset-0"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.currentTarget.nextSibling.focus();
                    }}
                />

                <input
                    type={type}
                    className={`
                        relative
                        w-full
                        h-12
                        rounded-md
                        border
                        border-border
                        px-4
                        text-base
                        hover:border-2 hover:border-focus-border
                        focus:outline-none focus:ring-1 focus:ring-focus-ring
                        ${error ? "border-red-600" : "border border-border"}
                        ${inputClassName}
                    `}
                    {...props}
                />
            </div>

            {error && (
                <p className="text-caption text-red-800 place-self-start">
                    {error}
                </p>
            )}
        </div>
    );
}
