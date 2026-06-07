import { z } from "zod";

// 📦 Schema para Material Devolutivo
export const devolutivoSchema = z.object({
  loanId: z
    .string()
    .min(1, "Debe ingresar el ID del préstamo"),

  returnDate: z
    .string()
    .min(1, "La fecha de devolución es requerida"),

  description: z
    .string()
    .min(5, "La descripción debe tener mínimo 5 caracteres")
    .max(200, "La descripción es demasiado larga"),

  status: z
    .string()
    .min(1, "Debe seleccionar un estado del material"),
});

// 📦 Schema para Material Consumible
export const consumibleSchema = z.object({
  loanId: z
    .string()
    .min(1, "Debe ingresar el ID del préstamo"),

  returnDate: z
    .string()
    .min(1, "La fecha de devolución es requerida"),

  observations: z
    .string()
    .min(5, "Las observaciones deben tener mínimo 5 caracteres")
    .max(200, "Las observaciones son demasiado largas"),

  quantity: z
    .number({
      invalid_type_error: "La cantidad devuelta debe ser un número",
    })
    .min(1, "Debe ingresar al menos 1 unidad"),

  status: z
    .string()
    .min(1, "Debe seleccionar un estado del material"),
});
