export default function TextArea({
    label,
    error,
    rows = 4,
    containerClassName = "",
    labelClassName = "",
    textareaClassName = "",
    ...props
}) {
    return (
        <div className={`w-[320px] ${containerClassName}`}>
            {label && (
                <label
                    className={`
                        block
                        text-[10px]
                        mb-1
                        place-self-start
                        ${error ? "text-red-800" : "text-text-primary"}
                        ${labelClassName}
                    `}
                >
                    {label}
                </label>
            )}

            <textarea
                rows={rows}
                className={`
                    w-full
                    rounded-md
                    border
                    border-border
                    px-4
                    py-3
                    text-base
                    resize-y
                    hover:border-2 hover:border-focus-border
                    focus:outline-none focus:ring-1 focus:ring-focus-ring
                    ${error ? "border-red-600" : "border border-border"}
                    ${textareaClassName}
                `}
                {...props}
            />

            {error && (
                <p className="text-caption text-red-800 place-self-start">
                    {error}
                </p>
            )}
        </div>
    );
}