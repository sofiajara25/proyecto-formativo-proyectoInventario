import { useState } from "react";
import { Input, Button } from "@/shared";
import { materialSchema } from "../schemas/materialSchema";

export default function MaterialUpdateForm() {
    const [formData, setFormData] = useState({
        custodian: "",
        toolId: "",
        senaPlate: "",
        materialName: "",
        entryDate: "",
        quantity: "",
        location: "",
        unitValue: "",
        totalValue: "",
        status: "",
        description: "",
    });

    const [errors, setErrors] = useState({});

    //=========================
    //      Handle Genérico
    //* Función que se ejecuta cada vez que cambia el valor de un input del formulario
    //==========================

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //=========================
    //      Handle Submit
    //* Función que se ejecuta cuando se envía el formulario
    //==========================

    const handleSubmit = (e) => {
        e.preventDefault();

        const result = materialSchema.safeParse(formData);

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
        console.log("Usuario válido:", result.data);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-600 via-green-600 to-purple-400 flex flex-col items-center justify-center">
            {/* Encabezado */}
            <header className="fixed top-0 left-0 w-full py-6 text-center">
                <h1 className="text-white text-2xl font-bold">
                    Sistema Inventario de Infraestructura y <br />Teleinformática CDITI SENA
                </h1>
            </header>
            <div className="bg-white p-8 rounded-xl w-full max-w-6xl ">
                <h1 className="text-primary text-2xl mb-6">Actualizar Material de Consumo</h1>
                <form
                    className="grid grid-cols-1 place-items-center gap-6"
                    onSubmit={handleSubmit}
                >
                    <div className="grid grid-cols-3 gap-6 mx-auto">

                        <Input
                            label="Custodian"
                            name="custodian"
                            value={formData.custodian}
                            onChange={handleChange}
                            error={errors.custodian}
                        />

                        <Input
                            label="Tool ID"
                            name="toolId"
                            value={formData.toolId}
                            onChange={handleChange}
                            error={errors.toolId}
                        />

                        <Input
                            label="SENA Plate"
                            name="senaPlate"
                            value={formData.senaPlate}
                            onChange={handleChange}
                            error={errors.senaPlate}
                        />

                        <Input
                            label="Material Name"
                            name="materialName"
                            value={formData.materialName}
                            onChange={handleChange}
                            error={errors.materialName}
                        />

                        <Input
                            label="Entry Date"
                            type="date"
                            name="entryDate"
                            value={formData.entryDate}
                            onChange={handleChange}
                            error={errors.entryDate}
                        />
                        <Input
                            label="Quantity"
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            error={errors.quantity}
                        />

                        <Input
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            error={errors.location}
                        />
                        <Input
                            label="Unit Value"
                            type="number"
                            name="unitValue"
                            value={formData.unitValue}
                            onChange={handleChange}
                            error={errors.unitValue}
                        />

                        <Input
                            label="Total Value"
                            type="number"
                            name="totalValue"
                            value={formData.totalValue}
                            onChange={handleChange}
                            error={errors.totalValue}
                        />
                        <Input
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            error={errors.status}
                        />


                        <Input
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            error={errors.description}
                        />

                    </div>

                    <div className="flex items-end justify-center gap-6">
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm">
                                Crear Material
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
