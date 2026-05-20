import { useState } from "react";
import { Input, Button, Select } from "@/shared";
// import {  } from "../schemas/returnSchema";
import { consumibleSchema, devolutivoSchema } from "../schemas/returnSchema";
import { useNavigate } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";

export default function ReturnForm() {
  const navigate = useNavigate();

  // Estados para cada formulario
  const [devolutivoData, setDevolutivoData] = useState({
    loanId: "",
    returnDate: "",
    description: "",
    status: "",
  });
  const [consumibleData, setConsumibleData] = useState({
    loanId: "",
    returnDate: "",
    observations: "",
    quantity: "",
    status: "",
  });

  const [errorsDevolutivo, setErrorsDevolutivo] = useState({});
  const [errorsConsumible, setErrorsConsumible] = useState({});

  const estados = [
    { value: "disponible", label: "Disponible" },
    { value: "mantenimiento", label: "Mantenimiento" },
    { value: "baja", label: "Baja" },
  ];

  // Handle genérico
  const handleChange = (e, setData) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Devolutivo
  const handleSubmitDevolutivo = (e) => {
    e.preventDefault();
    const result = devolutivoSchema.safeParse(devolutivoData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrorsDevolutivo(fieldErrors);
      return;
    }
    setErrorsDevolutivo({});
    console.log("Devolutivo válido:", result.data);
  };

  // Submit Consumible
  const handleSubmitConsumible = (e) => {
    e.preventDefault();
    const result = consumibleSchema.safeParse(consumibleData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrorsConsumible(fieldErrors);
      return;
    }
    setErrorsConsumible({});
    console.log("Consumible válido:", result.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 via-green-600 to-purple-600 flex flex-col items-center justify-center">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full py-6 text-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer"
        >
          <CircleArrowLeft size={36} color="#ffffff" />
        </button>
        <h1 className="text-white text-2xl font-bold">
          Sistema Inventario de Infraestructura y <br /> Teleinformática CDITI SENA
        </h1>
      </header>

      {/* Contenedor de dos formularios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl w-full max-w-6xl mt-40">
        
        {/* Formulario Devolutivo */}
        <form onSubmit={handleSubmitDevolutivo} className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-4">Crear Devolución de Material Devolutivo</h2>
          <Input
            label="ID del Préstamo"
            name="loanId"
            value={devolutivoData.loanId}
            onChange={(e) => handleChange(e, setDevolutivoData)}
            error={errorsDevolutivo.loanId}
          />
          <Input
            label="Fecha de Devolución"
            name="returnDate"
            type="date"
            value={devolutivoData.returnDate}
            onChange={(e) => handleChange(e, setDevolutivoData)}
            error={errorsDevolutivo.returnDate}
          />
          <Input
            label="Descripción del Material"
            name="description"
            value={devolutivoData.description}
            onChange={(e) => handleChange(e, setDevolutivoData)}
            error={errorsDevolutivo.description}
          />
          <Select
            label="Estado del material"
            name="status"
            options={estados}
            value={devolutivoData.status}
            onChange={(e) => handleChange(e, setDevolutivoData)}
            error={errorsDevolutivo.status}
          />
          <Button type="submit" variant="primary">Crear devolución</Button>
        </form>

        {/* Formulario Consumible */}
        <form onSubmit={handleSubmitConsumible} className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-4">Crear Devolución de Material Consumible</h2>
          <Input
            label="ID del Préstamo"
            name="loanId"
            value={consumibleData.loanId}
            onChange={(e) => handleChange(e, setConsumibleData)}
            error={errorsConsumible.loanId}
          />
          <Input
            label="Fecha de Devolución"
            name="returnDate"
            type="date"
            value={consumibleData.returnDate}
            onChange={(e) => handleChange(e, setConsumibleData)}
            error={errorsConsumible.returnDate}
          />
          <Input
            label="Observaciones"
            name="observations"
            value={consumibleData.observations}
            onChange={(e) => handleChange(e, setConsumibleData)}
            error={errorsConsumible.observations}
          />
          <Input
            label="Cantidad Devuelta"
            name="quantity"
            type="number"
            value={consumibleData.quantity}
            onChange={(e) => handleChange(e, setConsumibleData)}
            error={errorsConsumible.quantity}
          />
          <Select
            label="Estado del material"
            name="status"
            options={estados}
            value={consumibleData.status}
            onChange={(e) => handleChange(e, setConsumibleData)}
            error={errorsConsumible.status}
          />
          <Button type="submit" variant="primary">Crear devolución</Button>
        </form>
      </div>
    </div>
  );
}
