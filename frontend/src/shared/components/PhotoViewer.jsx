import { useState } from "react";
import Lightbox from "./Lightbox";

const API_ORIGIN = "http://localhost:5000";
const toAbsoluteUrl = (item) => `${API_ORIGIN}/${item.replace(/^\/+/, "")}`;

// Muestra la(s) foto(s) de un registro (material, préstamo, usuario...).
// - Si hay varias, se comporta como un carrusel (flechas + puntos).
// - Al hacer click en la foto, se abre en grande (Lightbox), con
//   navegación entre todas las fotos si hay más de una.
export default function PhotoViewer({
  photos = [],
  fallbackIcon = null,
  size = 80,
  rounded = "rounded-full",
  alt = "Foto",
}) {
  const list = (photos || []).filter(Boolean);
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (list.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${rounded} shrink-0`}
        style={{ width: size, height: size, background: "var(--color-primary-950)" }}
      >
        {fallbackIcon}
      </div>
    );
  }

  const goPrev = (e) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + list.length) % list.length);
  };
  const goNext = (e) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % list.length);
  };

  return (
    <>
      <div
        className={`relative group ${rounded} shrink-0 overflow-hidden cursor-zoom-in`}
        style={{ width: size, height: size, background: "var(--color-primary-950)" }}
        onClick={(e) => {
          e.stopPropagation();
          setLightboxOpen(true);
        }}
      >
        <img
          src={toAbsoluteUrl(list[index])}
          alt={alt}
          className="w-full h-full object-cover"
        />

        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-0.5 top-1/2 -translate-y-1/2 bg-black/40 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-0.5 top-1/2 -translate-y-1/2 bg-black/40 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Foto siguiente"
            >
              ›
            </button>
            <div className="absolute bottom-1 inset-x-0 flex justify-center gap-0.5">
              {list.map((_, i) => (
                <span
                  key={i}
                  className={`w-1 h-1 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={list.map(toAbsoluteUrl)}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
