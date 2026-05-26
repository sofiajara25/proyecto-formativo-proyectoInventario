export default function Input({
    label,
    type = "text",
    error,
    ...props
}) {
    // Cuerpo de la función 
    return (
        // Contenedor del input que se exporta con label, cuerpo y feedback message
        <div className="w-[320px]">
            {/* Label */}

            {label && (
                <label
                    className={`
                        block
                        text-[8px]
                        mb-1
                        place-self-start
                        ${error ? "text-red-800" : "text-text-primary"}
                        `}
                >
                    {label}
                </label>
            )}

            {/* Contenedor del input */}
            <div
                className="
                        relative
                        h-12
                        flex
                        items-center
                     ">
                {/* Area interactiva invisible de un input 48px */}
                <div
                    className="
                        absolute
                        inset-0
                    "
                    onMouseDown={(e) => {
                        e.preventDefault();
                        // Mueve el foco al siguiente elemento hermano del elemento atual.
                        // `currentTarget` referencia el elemento que tiene el heandler del evento.
                        // `nextSibling` obtiene el siguiente nodo en el DOM (puede ser un input u otro elemento)
                        // `focus()` cambia el foco del usuario hacia ese elemento
                        e.currentTarget.nextSibling.focus();
                    }} />

                {/* Area visual del input */}

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

                        hover:
                        hover:border-2
                        hover:border-focus-border


                        focus:outline-none
                        focus:ring-1
                        focus:ring-focus-ring

                        ${error ? "border-red-600" : "border border-border"}
                    `}
                    {...props}
                />
            </div>
            {/* Feedback */}
            {error && <p className="text-caption text-red-800 place-self-start">{error}</p>}
        </div>
    );
};