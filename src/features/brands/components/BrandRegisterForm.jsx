import { useState } from "react";
import { Button, Navbar } from "@/shared";
import { useNavigate } from "react-router-dom";

export default function BrandRegisterForm() {
  const navigate = useNavigate();

  const [marca, setMarca] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!marca.trim()) {
      setError("El nombre de la marca es requerido");
      return;
    }
    setError("");
    console.log("Marca creada:", marca);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
        fontFamily: "var(--main-font)",
      }}
    >
      <Navbar />

      <div className="flex flex-col flex-1 px-10 py-8 gap-4 justify-center">
        {/* Título */}
        <h1 
          style={{
            color: "var(--color-white)",
            fontSize: "var(--fs-md)",
            fontWeight: "var(--font-weight-bold)",
            margin: 0,
            marginLeft: "680px",
          }}
        >
          Crear Marca
        </h1>

        {/* Card */}
        <div
          className="bg-white rounded-2xl flex flex-col gap-6 w-full max-w-sm mx-auto shadow justify-center items-center"
          style={{ padding: "32px 36px" }}
        >
          <p
            style={{
              fontSize: "var(--fs-xxs)",
              color: "var(--color-gray-500)",
              margin: 0,
            }}
          >
            Completa el campo para registrar una nueva marca
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="marca"
              >
                Nombre de la marca
              </label>
              <input
                id="marca"
                type="text"
                placeholder="Ej: Samsung"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400 ${error ? "border-red-400" : ""
                  }`}
              />
              {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="md">
                Crear Marca
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
