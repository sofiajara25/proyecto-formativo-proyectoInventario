import { useState } from "react";
import { Input, Button, Select } from "@/shared";
import { loanSchema } from "../schemas/loansSchema.js";

export default function LoansRegisterForm() {

  const [formData, setFormData] = useState({
    user: "",
    category: "",
    productName: "",
    loanDate: "",
    returnDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const categorias = [
    { value: "herramienta", label: "Herramienta" },
    { value: "equipo", label: "Equipo" },
    { value: "consumible", label: "Consumible" },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = loanSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    console.log("Préstamo válido:", result.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 via-green-600 to-purple-400 flex flex-col items-center justify-center">
      {/* Encabezado */}
      <header className="fixed top-0 left-0 w-full py-6 text-center">
        <h1 className="text-white text-2xl font-bold">
          Sistema Inventario de Infraestructura y <br /> Teleinformática CDITI SENA
        </h1>
      </header>

      <div className="bg-white p-8 rounded-xl w-full max-w-5xl">
        <h1 className="text-primary text-2xl mb-6">Crear Préstamo</h1>

        <form
          className="grid grid-cols-1 place-items-center gap-6"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-2 gap-6 mx-auto">
            <Input
              label="Usuario"
              name="user"
              placeholder="Ingrese el usuario"
              value={formData.user}
              type="text"
              onChange={handleChange}
              error={errors.user}
            />

            <Select
              label="Categoría"
              name="category"
              options={categorias}
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
            />

            <Input
              label="Nombre del producto"
              name="productName"
              placeholder="Ingrese el nombre del producto"
              value={formData.productName}
              type="text"
              onChange={handleChange}
              error={errors.productName}
            />

            <Input
              label="Fecha préstamo"
              name="loanDate"
              type="date"
              value={formData.loanDate}
              onChange={handleChange}
              error={errors.loanDate}
            />

            <Input
              label="Fecha de devolución"
              name="returnDate"
              type="date"
              value={formData.returnDate}
              onChange={handleChange}
              error={errors.returnDate}
            />

            <Input
              label="Descripción"
              name="description"
              placeholder="Ingrese la descripción"
              value={formData.description}
              type="text"
              onChange={handleChange}
              error={errors.description}
            />
            
          </div>

          <div className="flex items-end justify-center gap-6">
            <Button type="submit" variant="primary" size="sm">
              Crear Préstamo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
