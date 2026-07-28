import { z } from "zod";

export const updateReturnSchema = z.object({
    materialType: z.string().min(1, "El tipo de material es requerido"),
    loanId: z.string().min(1, "El préstamo es requerido"),
    returnDate: z.string().min(1, "La fecha de devolución es requerida"),
    // 👆 aquí ya no hacemos refine para bloquear fechas anteriores
    returnDescription: z.string().min(3, "La descripción debe tener mínimo 3 caracteres"),
    returnQuantity: z.number({ invalid_type_error: "La cantidad debe ser un número" }).min(1),
    isAvailable: z.boolean(),
    isMaintenance: z.boolean(),
    isLow: z.boolean(),
});
