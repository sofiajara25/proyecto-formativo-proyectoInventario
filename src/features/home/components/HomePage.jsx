// src/features/home/pages/ListasrMainPage.jsx
import senaImg from "@/assets/images/Sena-1.jpg";

import { Navbar } from "@/shared";


export default function HomePage() {

  return (
    <div
      className="min-h-screen bg-white"
    >
      <Navbar />

      <div className="flex justify-center items-center py-10">
        <div
          className="  w-full relative"
              >
                <h1 style={{
                        color: "var(--color-black)",
                        fontSize: "var(--fs-md)",
                        fontWeight: "var(--font-weight-bold)",
                        margin: 0,
                        textAlign: "center"
                    }}>
                    Inventario Infraestructura - Teleinformática
                </h1>
                
                <img className="absolute w-[1600px] h-[493px]" src={senaImg} alt="Sena1" />

        </div>
      </div>
    </div>
  );
}