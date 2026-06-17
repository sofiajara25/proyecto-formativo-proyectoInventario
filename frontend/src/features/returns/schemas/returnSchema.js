import { z } from "zod";

export const returnSchema = z.object({
  materialType: z.enum(["devolutivo", "consumible"]), // 👈 acepta ambos
  loanId: z.string().min(1, "El ID del préstamo es obligatorio"),
  returnDate: z.string().min(1, "La fecha de devolución es obligatoria"),
  returnDescription: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres"),
  returnQuantity: z
    .number()
    .min(0, "La cantidad devuelta no puede ser negativa"), // 👈 siempre presente
  isAvailable: z.boolean(),
  isMaintenance: z.boolean(),
  isLow: z.boolean(),
});
