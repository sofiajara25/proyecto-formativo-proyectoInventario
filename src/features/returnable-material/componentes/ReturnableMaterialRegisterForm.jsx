import { useState } from "react";
import { Input, Button, Select } from "@/shared";
import { returnablematerialSchema } from "../schemas/returnablematerialSchema";
export default function ReturnableMaterialRegisterForm() {
  const [formData, setFormData] = useState({
    toolId: "",
    senaPlate: "",
    serial: "",
    materialName: "",
    model: "",
    unitValue: "",
    custodian: "",
    quantity: "",
    status: "",
    totalValue: "",
    dimensions: "",
    description: "",
    technicalSheet: "",
    location: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});

  const estados = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
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

    // Convertir valores numéricos antes de validar
    const parsedData = {
      ...formData,
      unitValue: Number(formData.unitValue),
      quantity: Number(formData.quantity),
      totalValue: Number(formData.totalValue),
    };

    const result = returnablematerialSchema.safeParse(parsedData);

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
    console.log("Material devolutivo válido:", result.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 via-green-600 to-purple-400 flex flex-col items-center justify-center">
      {/* Encabezado */}
      <header className="mb-8 text-center">
        <h1 className="text-white text-2xl font-bold">
          Sistema Inventario de Infraestructura y <br /> Teleinformática CDITI SENA
        </h1>
      </header>

      <div className="bg-white p-8 rounded-xl w-full max-w-6xl">
        <h1 className="text-primary text-2xl mb-6">Crear Material Devolutivo</h1>

        <form
          className="grid grid-cols-1 place-items-center gap-6"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-3 gap-6 mx-auto">
            {/* Fila 1 */}
            <Input label="ID Herramienta" name="toolId" value={formData.toolId} onChange={handleChange} error={errors.toolId} />
            <Input label="Placa SENA" name="senaPlate" value={formData.senaPlate} onChange={handleChange} error={errors.senaPlate} />
            <Input label="Serial" name="serial" value={formData.serial} onChange={handleChange} error={errors.serial} />

            {/* Fila 2 */}
            <Input label="Nombre del Material" name="materialName" value={formData.materialName} onChange={handleChange} error={errors.materialName} />
            <Input label="Modelo" name="model" value={formData.model} onChange={handleChange} error={errors.model} />
            <Input label="Valor Unitario" name="unitValue" type="number" value={formData.unitValue} onChange={handleChange} error={errors.unitValue} />

            {/* Fila 3 */}
            <Input label="Cuentadante" name="custodian" value={formData.custodian} onChange={handleChange} error={errors.custodian} />
            <Input label="Cantidad" name="quantity" type="number" value={formData.quantity} onChange={handleChange} error={errors.quantity} />
            <Select label="Estado" name="status" options={estados} value={formData.status} onChange={handleChange} error={errors.status} />

            {/* Fila 4 */}
            <Input label="Valor Total" name="totalValue" type="number" value={formData.totalValue} onChange={handleChange} error={errors.totalValue} />
            <Input label="Dimensiones" name="dimensions" value={formData.dimensions} onChange={handleChange} error={errors.dimensions} />
            <Input label="Descripción" name="description" value={formData.description} onChange={handleChange} error={errors.description} />

            {/* Fila 5 */}
            <Input label="Ficha Técnica" name="technicalSheet" value={formData.technicalSheet} onChange={handleChange} error={errors.technicalSheet} />
            <Input label="Ubicación" name="location" value={formData.location} onChange={handleChange} error={errors.location} />
            <Input label="Foto" name="photo" type="file" onChange={handleChange} error={errors.photo} />
          </div>

          {/* Acciones */}
          <div className="flex items-end justify-center gap-6">
            <Button type="submit" variant="primary" size="sm">
              Crear Material Devolutivo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
