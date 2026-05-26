import { useState } from "react";

export default function BrandUdpateForm() {
  const [marca, setMarca] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!marca.trim()) {
      setError("El nombre de la marca es requerido");
      return;
    }
    setError("");
    console.log("Marca creada:", marca);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 via-green-600 to-purple-600 flex flex-col items-center justify-center">
      <header className="fixed top-0 left-0 w-full  py-6  text-center z-50">
        <h1 className="text-white text-2xl font-bold">
        Sistema Inventario de Infraestructura y <br /> Teleinformática CDITI SENA
        </h1>
    </header>
      <div className="bg- p-8 rounded-xl shadow w-80 bg-white">
        <h2 className="text-xl font-semibold mb-6 text-center">Actualizar marca</h2>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la marca</label>
          <input
            type="text"
            placeholder="Ej: Samsung"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400 ${error ? "border-red-400" : ""}`}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-2 rounded-lg text-sm hover:bg-green-600"
        >
          Crear marca
        </button>
      </div>
    </div>
  );
}