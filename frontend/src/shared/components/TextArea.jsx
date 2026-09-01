import { useRef, useEffect } from "react";

export default function TextArea({
    label,
    error,
    containerClassName = "",
    labelClassName = "",
    textareaClassName = "",
    minRows = 3,
    maxRows = 10,
    ...props
}) {
    const textAreaRef = useRef(null);

    // Cada vez que cambia el valor, recalculamos la altura
    useEffect(() => {
        const el = textAreaRef.current;
        if (!el) return;

        el.style.height = "auto";

        const lineHeight = parseInt(window.getComputedStyle(el).lineHeight, 10) || 20;
        const minHeight = lineHeight * minRows;
        const maxHeight = lineHeight * maxRows;

        const newHeight = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);
        el.style.height = `${newHeight}px`;
    }, [props.value, minRows, maxRows]);

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

            <div className="relative flex items-center">
                <div
                    className="absolute inset-0"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.currentTarget.nextSibling.focus();
                    }}
                />

                <textarea
                    ref={textAreaRef}
                    rows={minRows}
                    className={`
                        relative
                        w-full
                        rounded-md
                        border
                        border-border
                        px-4
                        py-3
                        text-base
                        resize-none
                        overflow-hidden
                        hover:border-2 hover:border-focus-border
                        focus:outline-none focus:ring-1 focus:ring-focus-ring
                        ${error ? "border-red-600" : "border border-border"}
                        ${textareaClassName}
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