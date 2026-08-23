import { useEffect } from "react";

// Visor de foto a pantalla completa. Recibe "images" ya como URLs listas
// para usar en un <img src>  (absolutas o blob: no importa el origen).
// Funciona con una sola imagen (solo botón de cerrar) o con varias
// (flechas prev/next, contador y navegación con teclado).
export default function Lightbox({ images = [], index = 0, onIndexChange, onClose }) {
  const hasMultiple = images.length > 1;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (hasMultiple && e.key === "ArrowLeft") {
        onIndexChange((index - 1 + images.length) % images.length);
      }
      if (hasMultiple && e.key === "ArrowRight") {
        onIndexChange((index + 1) % images.length);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, images.length, hasMultiple, onClose, onIndexChange]);

  if (!images.length) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
        aria-label="Cerrar"
      >
        ✕
      </button>

      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onIndexChange((index - 1 + images.length) % images.length); }}
          className="absolute left-2 sm:left-6 text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Foto anterior"
        >
          ‹
        </button>
      )}

      <img
        src={images[index]}
        alt="Vista ampliada"
        className="max-w-full max-h-full object-contain rounded"
        onClick={(e) => e.stopPropagation()}
      />

      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onIndexChange((index + 1) % images.length); }}
          className="absolute right-2 sm:right-6 text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Foto siguiente"
        >
          ›
        </button>
      )}

      {hasMultiple && (
        <div className="absolute bottom-4 text-white text-sm">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
