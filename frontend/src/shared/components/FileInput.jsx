import { useRef, useState, useMemo, useEffect } from "react";
import { Infinity as InfinityLoader } from "ldrs/react";
import "ldrs/react/Infinity.css";
import Lightbox from "./Lightbox";

// Origen del backend donde viven los archivos ya subidos (ej. "uploads/foto.jpg").
const API_ORIGIN = "http://localhost:5000";

// Un elemento de "value" puede ser:
// - un File recién seleccionado por el usuario (aún no subido), o
// - un string con la ruta que ya devolvió el backend (ej. "uploads/foto.jpg"),
//   que representa un archivo que YA existe y se está mostrando para editar.
const isExistingFile = (item) => typeof item === "string";

const isPdfItem = (item) =>
    isExistingFile(item) ? /\.pdf$/i.test(item) : item.type === "application/pdf";

// Si el archivo ya existente no tiene una extensión reconocible (esto pasa
// con fotos subidas antes de que el backend guardara la extensión, ej. las
// fotos de usuario), no podemos saber con certeza si es imagen solo por el
// nombre. En ese caso asumimos que sí lo es e intentamos mostrarla — si
// falla al cargar, el <img onError> cae al ícono genérico igual.
const looksLikeImage = (item) => {
    if (isExistingFile(item)) {
        if (/\.(png|jpe?g|webp|gif)$/i.test(item)) return true;
        if (isPdfItem(item)) return false;
        return true; // sin extensión reconocida: intentamos como imagen
    }
    return item.type?.startsWith("image/");
};

const getFileLabel = (item) =>
    isExistingFile(item) ? item.split("/").pop() : item.name;

const getFileKindLabel = (item) => (isPdfItem(item) ? "PDF" : "Archivo");

const toAbsoluteUrl = (item) => `${API_ORIGIN}/${item.replace(/^\/+/, "")}`;

export default function FileInput({
    value = [],
    onChange,
    multiple = false,
    accept = "image/*,application/pdf",
}) {
    const inputRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [dragIndex, setDragIndex] = useState(null);
    // URLs que intentamos mostrar como imagen pero fallaron al cargar (ver
    // looksLikeImage): para esas caemos al ícono genérico en vez de un
    // <img> roto.
    const [failedUrls, setFailedUrls] = useState(() => new Set());
    // Índice (dentro de las fotos visibles como imagen) que se está viendo
    // en grande, o null si el visor está cerrado.
    const [zoomIndex, setZoomIndex] = useState(null);

    const previews = useMemo(
        () =>
            value.map((item) => {
                if (!looksLikeImage(item)) return { url: null, isObjectUrl: false };
                if (isExistingFile(item)) {
                    return { url: toAbsoluteUrl(item), isObjectUrl: false };
                }
                return { url: URL.createObjectURL(item), isObjectUrl: true };
            }),
        [value]
    );

    useEffect(() => {
        return () => {
            // Solo liberamos las URLs creadas con createObjectURL (archivos
            // nuevos). Las URLs de archivos ya existentes apuntan al backend
            // y no deben revocarse.
            previews.forEach(({ url, isObjectUrl }) => {
                if (isObjectUrl && url) URL.revokeObjectURL(url);
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

    // Lista (en orden) de las URLs que sí se muestran como imagen, para que
    // el visor en grande pueda navegar entre ellas con las flechas.
    // "imagePositionByIndex[i]" traduce el índice dentro de "value" al
    // índice dentro de esta lista de solo-imágenes.
    const imageUrls = [];
    const imagePositionByIndex = {};
    value.forEach((file, i) => {
        if (looksLikeImage(file) && !failedUrls.has(previews[i].url)) {
            imagePositionByIndex[i] = imageUrls.length;
            imageUrls.push(previews[i].url);
        }
    });

    return (
        <div className="flex flex-wrap items-center gap-2 max-w-full">
            {value.map((file, i) => (
                <div
                    key={i}
                    draggable={multiple} // solo arrastrar si es múltiple
                    onDragStart={() => setDragIndex(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => reorder(dragIndex, i)}
                    className="relative w-24 h-24 border rounded overflow-hidden group"
                >
                    {looksLikeImage(file) && !failedUrls.has(previews[i].url) ? (
                        <img
                            src={previews[i].url}
                            className="w-full h-full object-cover cursor-zoom-in"
                            onClick={() => setZoomIndex(imagePositionByIndex[i])}
                            onError={() =>
                                setFailedUrls((prev) => new Set(prev).add(previews[i].url))
                            }
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-[10px] px-1">
                            <span className="font-semibold">{getFileKindLabel(file)}</span>
                            <span className="truncate w-full text-center">{getFileLabel(file)}</span>
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

            {zoomIndex !== null && (
                <Lightbox
                    images={imageUrls}
                    index={zoomIndex}
                    onIndexChange={setZoomIndex}
                    onClose={() => setZoomIndex(null)}
                />
            )}
        </div>
    );

}
