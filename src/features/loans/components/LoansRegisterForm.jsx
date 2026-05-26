import { useState } from "react";
import { Input, Button, Select, Navbar } from "@/shared";
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
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        console.log("Préstamo válido:", result.data);
    };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}
        >
            <Navbar />

            <div className="flex flex-col flex-1 px-10 py-8 gap-4">

                {/* Título */}
                <h1 style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0 }}>
                    Crear Préstamo
                </h1>

                {/* Card */}
                <div className="bg-white rounded-2xl flex flex-col gap-6" style={{ padding: "32px 36px" }}>

                    <p style={{ fontSize: "var(--fs-xxs)", color: "var(--color-gray-500)", margin: 0 }}>
                        Completa los campos para registrar un nuevo préstamo
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        <div className="grid grid-cols-2 gap-6">

                            <Input
                                label="Usuario"
                                name="user"
                                placeholder="Ingrese el usuario"
                                type="text"
                                value={formData.user}
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
                                type="text"
                                value={formData.productName}
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
                                type="text"
                                value={formData.description}
                                onChange={handleChange}
                                error={errors.description}
                            />

                        </div>

                        {/* Acciones */}
                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                size="md"
                                onClick={() => window.history.back()}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                            >
                                Crear Préstamo
                            </Button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}