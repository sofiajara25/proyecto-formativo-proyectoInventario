// src/features/home/pages/ListasrMainPage.jsx

import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, PackageOpen, CornerUpRight, RefreshCw } from "lucide-react";
import { Navbar } from "@/shared";

const cards = [
  { titulo: "Gestionar Préstamo", ruta: "/dashboard/list-prestamo", icon: ArrowLeftRight },
  { titulo: "Gestionar Material de Devolutivo", ruta: "/dashboard/list-devolutivo", icon: PackageOpen },
  { titulo: "Gestionar Retorno de Material", ruta: "/dashboard/list-retorno", icon: CornerUpRight },
  { titulo: "Gestionar Material de Consumo", ruta: "/dashboard/list-consumo", icon: RefreshCw },
];

export default function ListasrMainPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))" }}
    >
      <Navbar />
      <div className="flex-1 flex justify-center items-center px-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-8" style={{ width: "600px" }}>
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.ruta}
                onClick={() => navigate(card.ruta)}
                className="bg-white rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer"
                style={{
                  border: "2px solid transparent",
                  padding: "36px 24px",
                  minHeight: "240px",
                  transition: "border-color 0.2s, transform 0.15s",
                  fontFamily: "var(--main-font)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-secundary-950)";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <Icon size={32} strokeWidth={1.2} color="var(--color-gray-800)" />
                <span style={{
                  fontSize: "var(--fs-sm)",
                  fontWeight: "var(--font-weight-bold)",
                  color: "var(--color-gray-900)",
                  lineHeight: "1.4",
                  textAlign: "center",
                }}>
                  {card.titulo}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}