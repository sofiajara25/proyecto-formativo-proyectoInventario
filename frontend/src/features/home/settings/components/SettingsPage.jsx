// src/features/home/pages/CreateHomePage.jsx

import { Navbar, Card } from "@/shared";
import { settings } from "../data/settings";
import { isSuperAdmin, hasPermission } from "@/shared/utils/permissions";

export default function SettinsPage() {
  // La tarjeta de "Grupos" (Grupos y Permisos) solo la ve el Super
  // Administrador. El resto de tarjetas se filtran por el permiso de
  // "listar" de cada módulo (product.permission); si una tarjeta no
  // declara permission, se deja visible.
  const visibleSettings = settings.filter((product) => {
    if (product.path === "/dashboard/access") return isSuperAdmin();
    if (!product.permission) return true;
    return hasPermission(product.permission);
  });

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))" }}
    >
      <Navbar />
      <div 
      className="
      flex-1
      flex 
      justify-center 
      items-center 
      px-6"
      >
        <div
        className="
        flex
        flex-wrap
        justify-center
        gap-16
        max-w-5xl"
        >
          {visibleSettings.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}