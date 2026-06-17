import { useState } from "react";
import { Input, Button, Select, Navbar, FileInput } from "@/shared";
import { loanSchema } from "../schemas/loansSchema.js";
import { createLoan } from "../services/loanService.js";
import { useNavigate } from "react-router-dom";

export default function LoansRegisterForm() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        loanUser: "",
        loanCategory: "",
        loanProductName: "",
        loanDate: "",
        loanReturnDate: "",
        loanDescription: "",
        photo: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación con Zod
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
        setIsSubmitting(true);

        try {

            const payload = {
                ...result.data,
                photo: result.data.photo?.[0]?.name ?? null,
            };
            // Payload validado

            // Aquí llamas al servicio que consume la API
            const response = await createLoan(payload);

            console.log("Préstamo creado:", response);
            alert("Préstamo creado correctamente");

            // Volver atrás
            window.history.back();
        } catch (error) {
            console.error("Error:", error.message);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    let label;
    // 😂 lógica fuera del JSX
    if (isSubmitting) {
        label = "Creando...";
    } else {
        label = "Crear prestamo";
    }



    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}
        >
            <Navbar />

            <div className="flex flex-col flex-1 px-10 py-8 gap-4 justify-center">

                {/* Título */}
                <h1  className="lg:pl-[70px]"
                    style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", margin: 0, }}>
                    Crear Préstamo
                </h1>

                {/* Card */}
                <div className="bg-white rounded-2xl flex flex-col gap-6 w-full max-w-6xl mx-auto " style={{ padding: "32px 36px" }}>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 place-items-center gap-6">

                        <div className="grid  gap-6 
                                lg:grid-cols-3
                                md:grid-cols-2
                                sm:grid-cols-1
                                ">

                            <Input
                                label="Usuario"
                                name="loanUser"
                                placeholder="Ingrese el usuario"
                                type="text"
                                value={formData.loanUser}
                                onChange={handleChange}
                                error={errors.loanUser}
                            />
                            <Select
                                label="Categoría"
                                name="loanCategory"
                                options={categorias}
                                value={formData.loanCategory}
                                onChange={handleChange}
                                error={errors.loanCategory}
                            />

                            <Input
                                label="Nombre del producto"
                                name="loanProductName"
                                placeholder="Ingrese el nombre del producto"
                                type="text"
                                value={formData.loanProductName}
                                onChange={handleChange}
                                error={errors.loanProductName}
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
                                name="loanReturnDate"
                                type="date"
                                value={formData.loanReturnDate}
                                onChange={handleChange}
                                error={errors.loanReturnDate}
                            />
                            <Input
                                label="Descripción"
                                name="loanDescription"
                                placeholder="Ingrese la descripción"
                                type="text"
                                value={formData.loanDescription}
                                onChange={handleChange}
                                error={errors.loanDescription}
                            />
                            {/* Contenedor del input */}
                            <div>
                                <h4>
                                    Foto
                                </h4>
                                <FileInput
                                    value={formData.photo}
                                    onChange={(files) =>
                                        setFormData((prev) => ({ ...prev, photo: files }))
                                    }
                                    multiple={true}
                                />
                                {errors.photo && (
                                    <span className="text-red-500 text-sm">{errors.photo}</span>
                                )}
                            </div>

                        </div>

                        {/* Acciones */}
                        <div className="flex justify-end gap-3 pt-2 w-full">
                            <Button
                                type="button"
                                variant="secondary"
                                size="md"
                                onClick={() => navigate(-1)}
                            >
                                Cancelar
                            </Button>
                            <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                                {label}
                                {/* {isSubmitting ? "Guardando..." : "Guardar"} */}
                            </Button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}