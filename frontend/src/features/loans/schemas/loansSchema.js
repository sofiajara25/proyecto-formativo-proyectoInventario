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

  loanQuantity: z
    .coerce
    .number({ invalid_type_error: "La cantidad debe ser un número" })
    .int("La cantidad debe ser un número entero")
    .min(1, "Debe solicitar al menos 1 unidad"),

  loanDate: z
    .string()
    .min(1, "La fecha de préstamo es requerida"),

  loanReturnDate: z
    .string()
    .min(1, "La fecha de devolución es requerida"),

  loanDescription: z
    .string()
    .min(5, "La descripción debe tener mínimo 5 caracteres")
    .max(200, "La descripción es demasiado larga"),

  photo: fileSchema.shape.files.or(z.array(z.instanceof(File)).max(0)).optional()
});