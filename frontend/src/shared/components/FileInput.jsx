import { useRef, useState, useMemo, useEffect } from "react";
import { Infinity as InfinityLoader } from "ldrs/react";
import "ldrs/react/Infinity.css";

export default function FileInput({
    value = [],
    onChange,
    multiple = false,
    accept = "image/*,application/pdf",
}) {
    const inputRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [dragIndex, setDragIndex] = useState(null);

    const isFile = (file) => file.type.startsWith("image/");

    const previews = useMemo(
        () => value.map((file) => (isFile(file) ? URL.createObjectURL(file) : null)),
        [value]
    );

    useEffect(() => {
        return () => {
            previews.forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [previews]);

    const handleFiles = async (files) => {
        setIsLoading(true);
        const list = Array.from(files);
        await new Promise((r) => setTimeout(r, 500));

        if (multiple) {
            onChange([...value, ...list].slice(0, 12)); // máximo 12
        } else {
            onChange(list.length ? [list[0]] : []); // máximo 1 archivo
        }

        setIsLoading(false);
    };

    const remove = (i) => {
        const copy = [...value];
        copy.splice(i, 1);
        onChange(copy);
    };

    const reorder = (from, to) => {
        const copy = [...value];
        const [m] = copy.splice(from, 1);
        copy.splice(to, 0, m);
        onChange(copy);
    };

    return (
        <div className="flex items-center gap-2">
            {value.map((file, i) => (
                <div
                    key={i}
                    draggable={multiple} // solo arrastrar si es múltiple
                    onDragStart={() => setDragIndex(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => reorder(dragIndex, i)}
                    className="relative w-24 h-24 border rounded overflow-hidden group"
                >
                    {isFile(file) ? (
                        <img src={previews[i]} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-[10px] px-1">
                            <span className="font-semibold">PDF</span>
                            <span className="truncate w-full text-center">{file.name}</span>
                        </div>
                    )}
                    <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100">
                        <button type="button" onClick={() => remove(i)} className="w-7 h-7 bg-white rounded-full text-black text-xs">❌</button>
                    </div>
                </div>
            ))}

            {/* 👇 Mostrar el cuadro “Seleccionar” solo si:
        - multiple=true (galería) → siempre
        - multiple=false (perfil) → solo si no hay foto */}
            {(multiple || value.length === 0) && (
                <div
                    onClick={() => !isLoading && inputRef.current.click()}
                    className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer"
                >
                    {isLoading ? (
                        <InfinityLoader
                            size="55"
                            stroke="4"
                            strokeLength="0.15"
                            bgOpacity="0.1"
                            speed="1.3"
                            color="black"
                        />
                    ) : (
                        <span className="text-blue-500 text-sm">Seleccionar</span>
                    )}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                hidden
                multiple={multiple}
                accept={accept}
                onChange={(e) => handleFiles(e.target.files)}
            />
        </div>
    );

}
