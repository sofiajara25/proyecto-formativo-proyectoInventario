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
}).refine((data) => {
  if (!data.returnDate) return false;
  const today = new Date();
  const returnDate = new Date(data.returnDate);
  if (isNaN(returnDate.getTime())) return false; // fecha inválida
  today.setHours(0, 0, 0, 0);
  returnDate.setHours(0, 0, 0, 0);
  return returnDate >= today;
}, { path: ["returnDate"], message: "La fecha de préstamo no puede ser anterior a hoy" })