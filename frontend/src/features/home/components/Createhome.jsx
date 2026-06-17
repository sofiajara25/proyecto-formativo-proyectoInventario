// src/features/home/pages/ListasrMainPage.jsx

import { useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  PackageOpen,
  CornerUpRight,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "@/shared";

const cards = [
  {
    titulo: "Gestionar Préstamo",
    ruta: "/dashboard/prestamo",
    icon: ArrowLeftRight,
  },
  {
    titulo: "Gestionar Material de Devolutivo",
    ruta: "/dashboard/devolutivo",
    icon: PackageOpen,
  },
  {
    titulo: "Gestionar Retorno de Material",
    ruta: "/dashboard/retorno",
    icon: CornerUpRight,
  },
  {
    titulo: "Gestionar Material de Consumo",
    ruta: "/dashboard/consumo",
    icon: RefreshCw,
  },
];

export default function ListasrMainPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))" }}
    >
      <Navbar />

      <div className="flex justify-center items-center px-6 py-10">
        <div
          className="grid grid-cols-2 gap-6 w-full"
          style={{ maxWidth: "860px" }}
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.ruta}
                onClick={() => navigate(card.ruta)}
                className="bg-white rounded-2xl flex flex-col items-center justify-center gap-6 cursor-pointer"
                style={{
                  border: "2.5px solid transparent",
                  padding: "48px 32px",
                  minHeight: "220px",
                  transition: "border-color 0.2s, transform 0.15s",
                  fontFamily: "var(--main-font)",
                }}
                className='
                border-[2.5px] border-transparent
                hover:border-yellow-400
                hover:scale-[1.02]
                transition-all duration-150
                '

                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <span
                  style={{
                    fontSize: "var(--fs-sm)",
                    fontWeight: "var(--font-weight-bold)",
                    color: "var(--color-gray-900)",
                    lineHeight: "1.5",
                    textAlign: "center",
                  }}
                >
                  {card.titulo}
                </span>
                <Icon size={56} strokeWidth={1.2} color="var(--color-gray-800)" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}