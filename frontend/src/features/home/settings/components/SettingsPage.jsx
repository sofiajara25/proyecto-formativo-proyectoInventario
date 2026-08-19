// src/features/home/pages/CreateHomePage.jsx

import { Navbar, Card } from "@/shared";
import { settings } from "../data/settings";

export default function SettinsPage() {
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
        grid
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-2 
        gap-16"
        >
          {settings.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}