import { Outlet } from "react-router-dom";
// import { Navbar }from "@/shared";

export default function DashboardLayout() {
  return (
    <div className="relative min-h-screen text-text-primary">
      {/* Fondo con imagen */}
      {/* <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      /> */}
      {/* <Navbar/> */}

      {/* Contenido dinámico de las páginas */}
      <main>
        <Outlet/>
      </main>
    </div>
  );
}
