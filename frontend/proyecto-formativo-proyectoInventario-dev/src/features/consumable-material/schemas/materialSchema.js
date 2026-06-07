import { z } from "zod";

export const materialSchema = z.object({

  custodian: z
    .string()
    .min(3, "El cuentadante debe tener mínimo 3 caracteres")
    .max(60, "El cuentadante es demasiado largo"),

  toolId: z
    .string()
    .min(1, "El ID de la herramienta es requerido"),

  senaPlate: z
    .string()
    .min(1, "La placa SENA es requerida"),

  materialName: z
    .string()
    .min(3, "El nombre del material debe tener mínimo 3 caracteres")
    .max(100, "El nombre del material es demasiado largo"),

  entryDate: z
    .string()
    .min(1, "La fecha de ingreso es requerida"),

  quantity: z
    .number({
      invalid_type_error: "La cantidad debe ser un número",
    })
    .min(1, "La cantidad debe ser al menos 1"),

  location: z
    .string()
    .min(3, "La ubicación debe tener mínimo 3 caracteres")
    .max(100, "La ubicación es demasiado larga"),

  unitValue: z
    .number({
      invalid_type_error: "El valor unitario debe ser un número",
    })
    .min(0, "El valor unitario no puede ser negativo"),

  totalValue: z
    .number({
      invalid_type_error: "El valor total debe ser un número",
    })
    .min(0, "El valor total no puede ser negativo"),

  status: z
    .string()
    .min(1, "Debe seleccionar un estado"),

  description: z
    .string()
    .min(5, "La descripción debe tener mínimo 5 caracteres")
    .max(200, "La descripción es demasiado larga"),
});
