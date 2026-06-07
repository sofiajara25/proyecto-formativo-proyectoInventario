// src/features/home/pages/ListasrMainPage.jsx

// imagenes del carrusel
import senaImg from "@/assets/images/Sena-1.jpg";
import senaImg2 from "@/assets/images/Sena-2.jpg";
import senaImg3 from "@/assets/images/Sena-3.jpg";

import { Navbar } from "@/shared";
import { useState, useEffect } from "react";

// lista de imagenes
const images = [
  { src: senaImg, alt: "Sena 1" },
  { src: senaImg2, alt: "Sena 2" },
  { src: senaImg3, alt: "Sena 3" },
];

export default function HomePage() {

  // imagen actual
  const [current, setCurrent] = useState(0);

  // cambia la imagen cada 2 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // boton anterior
  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  // boton siguiente
  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex justify-center items-center py-10">
        <div className="w-full relative">

          {/* titulo */}
          <h1
            style={{
              color: "var(--color-black)",
              fontSize: "var(--fs-md)",
              fontWeight: "var(--font-weight-bold)",
              margin: 0,
              textAlign: "center",
            }}
          >
            Inventario Infraestructura - Teleinformática
          </h1>

          {/* carrusel */}
          <div className="relative w-full mt-4 overflow-hidden">

            {/* imagen actual */}
            <img
              className="w-full h-[550px] object-cover object-center"
              src={images[current].src}
              alt={images[current].alt}
            />

            {/* flecha izquierda */}
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl"
            >
              ‹
            </button>

            {/* flecha derecha */}
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl"
            >
              ›
            </button>

            {/* puntitos */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full ${i === current ? "bg-white" : "bg-white/50"
                    }`}
                />
              ))}
            </div>

          </div>
          {/* fin carrusel */}

        </div>
      </div>
    </div>
  );
}