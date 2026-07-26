import { z } from "zod";
import { fileSchema } from "@/shared";

export const loanSchema = z.object({

  loanUser: z
    .string()
    .min(3, "El usuario debe tener mínimo 3 caracteres")
    .max(60, "El usuario es demasiado largo"),

  loanCategory: z
    .string()
    .min(1, "Debe seleccionar una categoría"),

  loanProductName: z
    .string()
    .min(3, "El nombre del producto debe tener mínimo 3 caracteres")
    .max(100, "El nombre del producto es demasiado largo"),

  loanDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"),

  loanReturnDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"),

  loanDescription: z
    .string()
    .min(5, "La descripción debe tener mínimo 5 caracteres")
    .max(200, "La descripción es demasiado larga"),

  photo: fileSchema.shape.files.or(z.array(z.instanceof(File)).max(0)).optional()
}).refine((data) => {
  if (!data.loanDate) return false;
  const today = new Date();
  const loanDate = new Date(data.loanDate);
  if (isNaN(loanDate.getTime())) return false; // fecha inválida
  today.setHours(0, 0, 0, 0);
  loanDate.setHours(0, 0, 0, 0);
  return loanDate >= today;
}, { path: ["loanDate"], message: "La fecha de préstamo no puede ser anterior a hoy" })
  .refine((data) => {
    if (!data.loanDate || !data.loanReturnDate) return false;
    const loanDate = new Date(data.loanDate);
    const returnDate = new Date(data.loanReturnDate);
    if (isNaN(loanDate.getTime()) || isNaN(returnDate.getTime())) return false; // fechas inválidas
    loanDate.setHours(0, 0, 0, 0);
    returnDate.setHours(0, 0, 0, 0);
    return returnDate >= loanDate;
  }, { path: ["loanReturnDate"], message: "La fecha de devolución no puede ser anterior a la fecha de préstamo" });

