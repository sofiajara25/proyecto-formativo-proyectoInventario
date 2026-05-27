import { useState } from "react";
import { Input, Button, Select, Navbar } from "@/shared";
import { returnablematerialSchema } from "../schemas/returnablematerialSchema";
import { useNavigate } from "react-router-dom";

export default function ReturnableMaterialRegisterForm() {
  const navigate = useNavigate();

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
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    console.log("Material devolutivo válido:", result.data);
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
          className="lg:ml-40"
          style={{
            color: "var(--color-white)",
            fontSize: "var(--fs-md)",
            fontWeight: "var(--font-weight-bold)",
            margin: 0,
            marginLeft: "410px",
          }}
        >
          Actualizar Material Devolutivo
        </h1>

        {/* Card */}
        <div
          className="bg-white rounded-2xl flex flex-col gap-6 lg:w-6xl mx-auto"
          style={{ padding: "32px 36px" }}
        >
          <p
            style={{
              fontSize: "var(--fs-xxs)",
              color: "var(--color-gray-500)",
              margin: 0,
            }}
          >
            Completa los campos para registrar un nuevo material devolutivo
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 lg:mx-5 md:mx-2"
          >
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
              {/* Fila 1 */}
              <Input
                label="ID Herramienta"
                name="toolId"
                value={formData.toolId}
                onChange={handleChange}
                error={errors.toolId}
              />
              <Input
                label="Placa SENA"
                name="senaPlate"
                value={formData.senaPlate}
                onChange={handleChange}
                error={errors.senaPlate}
              />
              <Input
                label="Serial"
                name="serial"
                value={formData.serial}
                onChange={handleChange}
                error={errors.serial}
              />

              {/* Fila 2 */}
              <Input
                label="Nombre del Material"
                name="materialName"
                value={formData.materialName}
                onChange={handleChange}
                error={errors.materialName}
              />
              <Input
                label="Modelo"
                name="model"
                value={formData.model}
                onChange={handleChange}
                error={errors.model}
              />
              <Input
                label="Valor Unitario"
                name="unitValue"
                type="number"
                value={formData.unitValue}
                onChange={handleChange}
                error={errors.unitValue}
              />

              {/* Fila 3 */}
              <Input
                label="Cuentadante"
                name="custodian"
                value={formData.custodian}
                onChange={handleChange}
                error={errors.custodian}
              />
              <Input
                label="Cantidad"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                error={errors.quantity}
              />
              <Select
                label="Estado"
                name="status"
                options={estados}
                value={formData.status}
                onChange={handleChange}
                error={errors.status}
              />

              {/* Fila 4 */}
              <Input
                label="Valor Total"
                name="totalValue"
                type="number"
                value={formData.totalValue}
                onChange={handleChange}
                error={errors.totalValue}
              />
              <Input
                label="Dimensiones"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                error={errors.dimensions}
              />
              <Input
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
              />

              {/* Fila 5 */}
              <Input
                label="Ficha Técnica"
                name="technicalSheet"
                value={formData.technicalSheet}
                onChange={handleChange}
                error={errors.technicalSheet}
              />
              <Input
                label="Ubicación"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
              />
              <Input
                label="Foto"
                name="photo"
                type="file"
                onChange={handleChange}
                error={errors.photo}
              />
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
                Actualizar Material Devolutivo
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
