// src/features/home/pages/CreateHomePage.jsx

// import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar, Card } from "@/shared";
import { settings } from "../data/settings";


export default function SettinsPage() {

  return (
    <div className="min-h-screen  bg-gradient-to-l from-green-600 via-green-600 to-purple-600 ">
      <Navbar />
      
      <div
        className="
                    grid
                    justify-center
                    items-center
                    mt-60
                    gap-4
                    mx-6
                    sm:grid-cols-1
                    sm:mx-12
                    lg:grid-cols-2
                    xl:grid-cols-3
                    justify-items-center
                ">
        {settings.map((product) => (
          <Card key={product.id} product={product} />
        ))}

      </div>
    </div>
  );
}