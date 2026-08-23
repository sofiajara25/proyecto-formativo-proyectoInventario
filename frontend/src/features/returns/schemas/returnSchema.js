import { z } from "zod";

export const returnSchema = z.object({
  materialType: z.enum(["devolutivo", "consumible"]), // 👈 acepta ambos
  loanId: z.string().min(1, "El ID del préstamo es obligatorio"),
  // A qué material puntual del préstamo corresponde esta devolución (un
  // préstamo puede tener varios materiales, y se devuelven de a uno).
  loanItemId: z.string().min(1, "Debe seleccionar el material a devolver"),
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

  // Parseamos "YYYY-MM-DD" como fecha LOCAL (no UTC). new Date(string)
  // interpreta ese formato como medianoche UTC, y al convertirlo a horario
  // local (ej. Colombia, UTC-5) puede "caer" al día anterior, haciendo que
  // la fecha de hoy parezca anterior a hoy.
  const [year, month, day] = data.returnDate.split("-").map(Number);
  const returnDate = new Date(year, (month || 1) - 1, day || 1);
  if (isNaN(returnDate.getTime())) return false; // fecha inválida

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  returnDate.setHours(0, 0, 0, 0);

  return returnDate >= today;
}, { path: ["returnDate"], message: "La fecha de devolución no puede ser anterior a hoy" })