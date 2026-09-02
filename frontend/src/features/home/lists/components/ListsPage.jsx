// src/features/home/pages/ListasrMainPage.jsx

import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, PackageOpen, CornerUpRight, RefreshCw } from "lucide-react";
import { Navbar } from "@/shared";
import { hasPermission } from "@/shared/utils/permissions";

const cards = [
  { titulo: "Gestionar Préstamo", ruta: "/dashboard/list-prestamo", icon: ArrowLeftRight, permission: "list_loan" },
  { titulo: "Gestionar Material de Devolutivo", ruta: "/dashboard/list-devolutivo", icon: PackageOpen, permission: "list_returnable_material" },
  { titulo: "Gestionar Retorno de Material", ruta: "/dashboard/list-retorno", icon: CornerUpRight, permission: "list_return" },
  { titulo: "Gestionar Material de Consumo", ruta: "/dashboard/list-consumo", icon: RefreshCw, permission: "list_consumable_material" },
];

export default function ListasrMainPage() {
  const navigate = useNavigate();
  const visibleCards = cards.filter((card) => !card.permission || hasPermission(card.permission));
  // Con 3 tarjetas se ven mejor en una sola fila; con cualquier otra
  // cantidad se deja la cuadrícula de 2 columnas de siempre.
  const isThree = visibleCards.length === 3;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))" }}
    >
      <Navbar />
      <div className="flex-1 flex justify-center items-center px-6">
        <div
          className={`grid gap-4 sm:gap-8 ${isThree ? "grid-cols-3" : "grid-cols-2"}`}
          style={{ width: isThree ? "900px" : "600px", maxWidth: "100%" }}
        >
          {visibleCards.map((card) => {
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