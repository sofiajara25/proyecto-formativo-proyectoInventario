import { useState } from "react";
import { createPortal } from "react-dom";
import { Input, Button, FileInput } from "@/shared";
import { quotationSchema } from "../schemas/quotationSchema";
import { createQuotation } from "../services/quotationService";

export default function QuotationsRegisterForm({ onClose, onCreated }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        quotationName: "",
        pdf: [],
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = quotationSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        setErrors({});
        try {
            const response = await createQuotation(result.data);
            onCreated?.(response.quotation);
            onClose();
        } catch (error) {
            console.error("Error:", error.message);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-[420px]"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-xl font-medium text-center text-gray-900">
                    Crear cotización
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
                    <Input
                        label="Nombre de la cotización"
                        name="quotationName"
                        placeholder="Ej. Cotización taladros agosto"
                        value={formData.quotationName}
                        onChange={handleChange}
                        error={errors.quotationName}
                        containerClassName="w-full max-w-full"
                    />

                    <div>
                        <span>PDF de la cotización <span style={{ color: "red" }}>*</span></span>
                        <FileInput
                            value={formData.pdf}
                            onChange={(files) => setFormData((prev) => ({ ...prev, pdf: files }))}
                            multiple={false}
                            accept="application/pdf"
                        />
                        {errors.pdf && (
                            <span className="text-red-500 text-sm block">{errors.pdf}</span>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="secondary" size="md" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creando..." : "Crear cotización"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
