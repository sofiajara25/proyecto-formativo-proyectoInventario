import { useEffect, useState } from "react";
import { Input, Button, Select, Navbar, FileInput, Modal, TextArea } from "@/shared";
import { loanSchema } from "../schemas/loansSchema.js";
import { createLoan } from "../services/loanService.js";
import { useNavigate } from "react-router-dom";
import { getConsumables } from "../../consumable-material/services/consumableMaterialService.js";
import { getReturnables } from "../../returnable-material/services/returnableMaterialService.js";

export default function LoansRegisterForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        { value: "", label: "Selecciona una opción" }, // 🔹 opción inicial
        { value: "herramienta", label: "Herramienta" },
        { value: "equipo", label: "Equipo" },
        { value: "consumible", label: "Consumible" },
    ];

    const [materials, setMaterials] = useState([
        { value: "", label: "Selecciona una opción" } // 🔹 opción inicial
    ]);

    useEffect(() => {
        Promise.all([getConsumables(), getReturnables()])
            .then(([consumables, returnables]) => {
                const consumableList = consumables.map(c => ({
                    value: c.material_name,   // usa el campo correcto
                    label: `${c.material_name} (Consumo)`
                }));
                const returnableList = returnables.map(r => ({
                    value: r.material_name,
                    label: `${r.material_name} (Devolutivo)`
                }));
                setMaterials([
                    { value: "", label: "Selecciona una opción" }, // 🔹 siempre al inicio
                    ...consumableList,
                    ...returnableList
                ]);
            })
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const result = loanSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0];
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        const exists = materials.some(m => m.value === formData.loanProductName);

        if (!exists) {
            setErrors({ loanProductName: "Debe seleccionar un producto válido" });
            setIsSubmitting(false);
            return;
        }

        // Validar fechas
        const today = new Date();
        const loanDate = new Date(formData.loanDate);
        const returnDate = new Date(formData.loanReturnDate);

        if (loanDate < today.setHours(0, 0, 0, 0)) {
            setErrors({ loanDate: "La fecha de préstamo no puede ser anterior a hoy" });
            setIsSubmitting(false);
            return;
        }

        if (returnDate < loanDate) {
            setErrors({ loanReturnDate: "La fecha de devolución no puede ser anterior a la fecha de préstamo" });
            setIsSubmitting(false);
            return;
        }

        setErrors({});
        try {
            const response = await createLoan(result.data);
            console.log("Préstamo creado:", response);
            navigate(-1);
        } catch (error) {
            console.error("Error:", error.message);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    };

    let label;
    if (isSubmitting) {
        label = "Creando...";
    } else {
        label = "Crear prestamo";
    }

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))",
                fontFamily: "var(--main-font)",
            }}
        >
            <Navbar />

            <div className="flex flex-col flex-1 px-4 sm:px-10 py-6 sm:py-8 gap-4 justify-center">

                {/* Título */}
                <h1
                    className="sm:pl-[70px]"
                    style={{
                        color: "var(--color-white)",
                        fontSize: "var(--fs-md)",
                        fontWeight: "var(--font-weight-bold)",
                        margin: 0,
                    }}
                >
                    Crear Préstamo
                </h1>

                {/* Card */}
                <div
                    className="bg-white rounded-2xl flex flex-col gap-6 w-full max-w-6xl mx-auto"
                    style={{ padding: "20px 16px" }}
                >
                    <form
                        onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }}
                        className="grid grid-cols-1 place-items-center gap-6"
                    >
                        <div className="grid gap-4 sm:gap-6 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <Input
                                    label="Usuario"
                                    name="loanUser"
                                    placeholder="Ingrese el usuario"
                                    type="text"
                                    value={formData.loanUser}
                                    onChange={handleChange}
                                    error={errors.loanUser}
                                />
                            </div>

                            <div className="w-full [&>div]:w-full [&>div>select]:w-full">
                                <Select
                                    label="Categoría"
                                    name="loanCategory"
                                    options={categorias}
                                    value={formData.loanCategory}
                                    onChange={handleChange}
                                    error={errors.loanCategory}
                                />
                            </div>

                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <Select
                                    label="Producto"
                                    name="loanProductName"
                                    options={materials}
                                    value={formData.loanProductName}
                                    onChange={handleChange}
                                    error={errors.loanProductName}
                                />
                            </div>

                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <Input
                                    label="Fecha préstamo"
                                    name="loanDate"
                                    type="date"
                                    value={formData.loanDate}
                                    onChange={handleChange}
                                    error={errors.loanDate}
                                />
                            </div>

                            <div className="w-full [&>div]:w-full [&>div>input]:w-full">
                                <Input
                                    label="Fecha de devolución"
                                    name="loanReturnDate"
                                    type="date"
                                    value={formData.loanReturnDate}
                                    onChange={handleChange}
                                    error={errors.loanReturnDate}
                                />
                            </div>

                            <div className="w-full [&>div]:w-full [&>div>textarea]:w-full">
                                <TextArea
                                    label="Descripción"
                                    name="loanDescription"
                                    placeholder="Ingrese la descripción"
                                    type="text"
                                    value={formData.loanDescription}
                                    onChange={handleChange}
                                    error={errors.loanDescription}
                                    rows={1}
                                />
                            </div>

                            <div>
                                <h4 className="text-xs mb-1">Foto</h4>
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
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 w-full">
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
                            </Button>
                        </div>

                    </form>

                    <Modal
                        isOpen={isModalOpen}
                        title="Confirmar creación de préstamo"
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleSubmit}
                        confirmText="Crear"
                        cancelText="Cancelar"
                    >
                        <p>¿Seguro que deseas crear este préstamo?</p>
                    </Modal>
                </div>

            </div>
        </div>
    );
}