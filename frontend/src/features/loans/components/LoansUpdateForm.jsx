import { useState, useEffect } from "react";
import { Input, Button, Select, Navbar, FileInput, Modal, TextArea } from "@/shared";
import { loanSchema } from "../schemas/loansSchema.js";
import { getLoanById, updateLoan } from "../services/loanService.js";
import { useNavigate, useParams } from "react-router-dom";

export default function LoansRegisterForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { loan_id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        loanUser: "",
        loanCategory: "",
        loanProductName: "",
        loanDate: "",
        loanReturnDate: "",
        loanDescription: "",
        loanState: "",
        photo: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const categorias = [
        { value: "herramienta", label: "Herramienta" },
        { value: "equipo", label: "Equipo" },
        { value: "consumible", label: "Consumible" },
    ];

    const estados = [
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" },
    ];

    useEffect(() => {
        getLoanById(loan_id)
            .then((data) =>
                setFormData({
                    loanUser: data.loan_user,
                    loanCategory: data.category,
                    loanProductName: data.product_name,
                    loanDate: data.loan_date?.slice(0, 10) || "",
                    loanReturnDate: data.return_date?.slice(0, 10) || "",
                    loanDescription: data.description,
                    loanState: data.state,
                    photo: [],
                })
            )
            .catch((err) => console.error("Error cargando prestamo:", err));
    }, [loan_id]);

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

        // Validar fechas igual que en crear
        const today = new Date();
        const loanDate = new Date(formData.loanDate);
        const returnDate = new Date(formData.loanReturnDate);

        today.setHours(0, 0, 0, 0);
        loanDate.setHours(0, 0, 0, 0);
        returnDate.setHours(0, 0, 0, 0);

        if (loanDate < today) {
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
            const response = await updateLoan(loan_id, result.data);
            console.log("Préstamo actualizado:", response);
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
        label = "Actualizando...";
    } else {
        label = "Actualizar prestamo";
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
                    Actualizar Préstamo
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
                                    label="Documento del usuario"
                                    name="loanUser"
                                    placeholder="Ingrese el número de documento"
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
                                <Input
                                    label="Nombre del producto"
                                    name="loanProductName"
                                    placeholder="Ingrese el nombre del producto"
                                    type="text"
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

                            <div className="w-full [&>div]:w-full [&>div>select]:w-full">
                                <Select
                                    label="Estado"
                                    name="loanState"
                                    options={estados}
                                    value={formData.loanState}
                                    onChange={handleChange}
                                    error={errors.loanState}
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
                        title="Confirmar actualización de préstamo"
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleSubmit}
                        confirmText="Actualizar"
                        cancelText="Cancelar"
                    >
                        <p>¿Seguro que deseas actualizar este préstamo?</p>
                    </Modal>

                </div>

            </div>
        </div>
    );
}