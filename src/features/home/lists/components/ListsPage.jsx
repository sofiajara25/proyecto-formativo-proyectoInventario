// src/features/home/pages/CreateHomePage.jsx

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/shared";

const cards = [
  { titulo: "Gestinar Préstamo", ruta: "/dashboard/list-prestamo" },
  { titulo: "Gestinar Material de Devolutivo", ruta: "/dashboard/devolutivo" },
  { titulo: "Gestinar Retorno", ruta: "/dashboard/list-retorno" },
  { titulo: "Gestinar Material de Consumo", ruta: "/dashboard/list-consumo" },
];

export default function ListPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  bg-gradient-to-l from-green-600 via-green-600 to-purple-600 ">
      <Navbar/>

      {/* Área central con las cards */}
      <div className="flex justify-center items-center px-6 py-16">
        <div className="grid grid-cols-2 gap-6 w-full" style={{ maxWidth: "700px" }}>

          {/* Recorremos el arreglo y mostramos cada card */}
          {cards.map((card) => (
            <button
              key={card.ruta}
              onClick={() => navigate(card.ruta)}
              className="bg-white rounded-2xl flex items-center justify-center cursor-pointer"
              style={{ border: "2px solid transparent", padding: "50px 30px", minHeight: "180px", transition: "border-color 0.2s, transform 0.2s" }}
            >
              <span className="text-sm font-medium text-center" style={{ color: "#1a1a1a", lineHeight: "1.5" }}>
                {card.titulo}
              </span>
            </button>
          ))}

        </div>
      </div>

    </div>
  );
}