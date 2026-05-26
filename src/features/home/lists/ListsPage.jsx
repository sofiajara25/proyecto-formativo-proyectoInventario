import { useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  PackageOpen,
  Users,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "@/shared";

const cards = [
  { titulo: "Gestionar Préstamo", ruta: "/dashboard/list-prestamo", icon: ArrowLeftRight },
  { titulo: "Gestionar Material de Devolutivo", ruta: "/dashboard/devolutivo", icon: PackageOpen },
  { titulo: "Gestionar Usuarios", ruta: "/dashboard/list-usuarios", icon: Users },
  { titulo: "Gestionar Material de Consumo", ruta: "/dashboard/list-consumo", icon: RefreshCw },
];

export default function CreateHomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}
    >
      <Navbar />

      <div className="flex justify-center items-center px-6 py-10">
        <div className="grid grid-cols-2 gap-6 w-full" style={{ maxWidth: "860px" }}>

          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.ruta}
                onClick={() => navigate(card.ruta)}
                className="bg-white rounded-2xl flex flex-col items-center justify-center gap-6 cursor-pointer transition-all"
                style={{ border: "2.5px solid transparent", padding: "48px 32px", minHeight: "220px", fontFamily: "var(--main-font)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-secundary-950)";
                  e.currentTarget.style.transform = "scale(1.02)";
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