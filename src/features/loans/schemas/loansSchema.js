import { z } from "zod";

export const loanSchema = z.object({

  user: z
    .string()
    .min(3, "El usuario debe tener mínimo 3 caracteres")
    .max(60, "El usuario es demasiado largo"),

  category: z
    .string()
    .min(1, "Debe seleccionar una categoría"),

  productName: z
    .string()
    .min(3, "El nombre del producto debe tener mínimo 3 caracteres")
    .max(100, "El nombre del producto es demasiado largo"),

  loanDate: z
    .string()
    .min(1, "La fecha de préstamo es requerida"),

  returnDate: z
    .string()
    .min(1, "La fecha de devolución es requerida"),

  description: z
    .string()
    .min(5, "La descripción debe tener mínimo 5 caracteres")
    .max(200, "La descripción es demasiado larga"),
});
