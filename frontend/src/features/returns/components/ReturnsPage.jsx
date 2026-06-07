import { useState } from "react";
import { Input, Button, Select, Checkbox } from "@/shared";
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
  });
  const [consumibleData, setConsumibleData] = useState({
    loanId: "",
    returnDate: "",
    observations: "",
    quantity: "",

    // Flags booleanos
    isAvailable: true,
    isMaintenance: false,
    isLow: false,
  });

  const [errorsDevolutivo, setErrorsDevolutivo] = useState({});
  const [errorsConsumible, setErrorsConsumible] = useState({});

  const handleChange = (e, setData) => {
    // Se obtiene el nombre del campo y su valor
    const { name, value, type, checked } = e.target;

    setData((prev) => ({
      // Se copian todos los valores anteriores del estado
      ...prev,

      // Se actualiza unicamente lo que cambió
      [name]: type === "checkbox" ? checked : value,
    }));
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

    <div className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
        fontFamily: "var(--main-font)",
      }}>
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

      <div className="grid grid-cols-2 gap-22">

        {/* Devolucion de matreial devolutivo */}
        <div className="min-h-[500px] bg-white p-8 rounded-xl w-3xl mt-40">
          <h2 className="lg:ml-40"
            style={{
              color: "var(--color-white)",
              fontSize: "var(--fs-md)",
              fontWeight: "var(--font-weight-bold)",
              margin: 0,
              marginLeft: "410px",
            }}>
            Crear Devolución de Material Devolutivo</h2>

          <p
            style={{
              fontSize: "var(--fs-xxs)",
              color: "var(--color-gray-500)",
              margin: 0,
            }}
          >
            Completa los campos para registrar un nuevo material devolutivo
          </p>

          {/* Formulario Devolutivo */}
          <form onSubmit={handleSubmitDevolutivo} className="flex flex-col gap-4">

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-6 mx-auto">
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
                containerClassName="w-[686px]"
              />
            </div>
            {/* Checkbox */}
            <div className="flex flex-col items-center justify-center gap-8 mt-8">
              <h2>Estado del material</h2>

              <div className="flex flex-2 gap-40 items-center justify-center mt-4">
                <Checkbox
                  id="isAvailable"
                  name="isAvailable"
                  label="Disponible"
                  checked={consumibleData.isAvailable}
                  onChange={(e) => handleChange(e, setConsumibleData)}
                  className="accent-green-600"
                />
                <Checkbox
                  id="isMaintenance"
                  name="isMaintenance"
                  label="Mantenimiento"
                  checked={consumibleData.isMaintenance}
                  onChange={(e) => handleChange(e, setConsumibleData)}
                  className="accent-brand-2"
                />
                <Checkbox
                  id="isLow"
                  name="isLow"
                  label="Baja"
                  checked={consumibleData.isLow}
                  onChange={(e) => handleChange(e, setConsumibleData)}
                  className="accent-black"
                />
              </div>
            </div>

            {/* Boton */}
            <div className="flex items-end justify-center gap-6 mt-6">
              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                Crear devolucion
              </Button>
            </div>
          </form>
        </div>

        {/*####################################################################*/}

        {/* Crear Devolución de Material Consumible */}

        <div className="min-h-[500px] bg-white p-8 rounded-xl w-3xl mt-40">

          <h2 className="text-xl font-semibold mb-4 place-self-center">Crear Devolución de Material Consumible</h2>

          {/* Formulario Consumible */}
          <form className="grid grid-cols-1 place-items-center gap-6 mt-10"
            onSubmit={handleSubmitConsumible}>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-6 mx-auto">
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
            </div>

            {/* Checkbox */}
            <div className="flex flex-col items-center justify-center gap-8 mt-8">
              <h2>Estado del material</h2>

              <div className="flex flex-2 gap-40 items-center justify-center mt-4">
                <Checkbox
                  id="isAvailable"
                  name="isAvailable"
                  label="Disponible"
                  checked={consumibleData.isAvailable}
                  onChange={(e) => handleChange(e, setConsumibleData)}
                  className="accent-green-600"
                />
                <Checkbox
                  id="isMaintenance"
                  name="isMaintenance"
                  label="Mantenimiento"
                  checked={consumibleData.isMaintenance}
                  onChange={(e) => handleChange(e, setConsumibleData)}
                  className="accent-brand-2"
                />
                <Checkbox
                  id="isLow"
                  name="isLow"
                  label="Baja"
                  checked={consumibleData.isLow}
                  onChange={(e) => handleChange(e, setConsumibleData)}
                  className="accent-black"
                />
              </div>
            </div>

            {/* Boton */}
            <div className="flex items-end justify-center gap-6 mt-6">
              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                Crear devolucion
              </Button>
            </div>
          </form>
        </div >
      </div>

    </div>
  );
}
