import { useState, useEffect } from "react";
import { Button, Navbar, Modal } from "@/shared";
import { useNavigate, useParams } from "react-router-dom";
import { inventoryNameSchema } from "../schemas/inventoryNameSchema";
import { getInventoryNameById, updateInventoryName } from "../services/inventoryNameService";

export default function UpdateInventoryNamePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { inventory_name_id } = useParams();

    const [formData, setFormData] = useState({ inventoryName: "" });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar inventoryName existente
    useEffect(() => {
        getInventoryNameById(inventory_name_id)
            .then((brand) => setFormData({ inventoryName: brand.inventoryName }))
            .catch((err) => console.error("Error cargando inventoryName:", err));
    }, [inventory_name_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const result = inventoryNameSchema.safeParse(formData);
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
            await updateInventoryName(inventory_name_id, result.data);
            navigate(-1);
        } catch (error) {
            console.error("Error:", error.message);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to left, var(--color-primary-950), var(--color-tertiary-950))", fontFamily: "var(--main-font)" }}>
            <Navbar />
            <div className="flex flex-col flex-1 px-10 py-8 gap-4 justify-center">
                <h1 style={{ color: "var(--color-white)", fontSize: "var(--fs-md)", fontWeight: "var(--font-weight-bold)", marginLeft: "450px" }}>
                    Actualizar Nombre de Inventario
                </h1>
                <div className="bg-white rounded-2xl flex flex-col gap-6 w-full max-w-sm mx-auto shadow justify-center items-center" style={{ padding: "32px 36px" }}>
                    <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-2">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="inventoryName">
                                Nombre del Inventario
                            </label>
                            <input
                                inventory_name_id="inventoryName"
                                name="Nombre de inventario"
                                type="text"
                                value={formData.inventoryName}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400 ${errors.inventoryName ? "border-red-400" : ""}`}
                            />
                            {errors.inventoryName && <p className="text-red-500 text-xs mt-1">{errors.inventoryName}</p>}
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="secondary" size="md" onClick={() => navigate(-1)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" size="md" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Guardando..." : "Actualizar"}
                            </Button>
                        </div>
                    </form>
                    <Modal
                        isOpen={isModalOpen}
                        title="Confirmar actualización de nombre de inventario"
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleSubmit}
                        confirmText="Actualizar"
                        cancelText="Cancelar"
                    >
                        <p>¿Seguro que deseas actualizar este nombre de inventario?</p>
                    </Modal>

                </div>
            </div>
        </div>
    );
}
