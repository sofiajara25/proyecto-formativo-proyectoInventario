import { useState } from "react";
import { Input, Button, Navbar } from "@/shared";
import { materialSchema } from "../schemas/materialSchema";

export default function MaterialRegisterForm () {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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
        console.log("Material válido:", result.data);
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
                        marginLeft: "400px"
                    }}
                >
                    Crear Material de Consumo
                </h1>

                {/* Card */}
                <div
                    className="bg-white rounded-2xl flex flex-col gap-6 w-full max-w-6xl mx-auto"
                    style={{ padding: "32px 36px" }}
                >
                    <p
                        style={{
                            fontSize: "var(--fs-xxs)",
                            color: "var(--color-gray-500)",
                            margin: 0,
                        }}
                    >
                        Completa los campos para registrar un nuevo material
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 place-items-center gap-6"
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

                        {/* Acciones */}
                        <div className="flex justify-end gap-3 pt-2 w-full">
                            <Button type="submit" variant="primary" size="md">
                                Crear Material
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
