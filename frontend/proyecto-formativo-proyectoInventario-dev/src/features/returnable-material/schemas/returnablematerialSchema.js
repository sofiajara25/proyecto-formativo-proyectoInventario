import { z } from "zod";

export const returnablematerialSchema = z.object({

  toolId: z
    .string()
    .min(1, "El ID de la herramienta es requerido"),

  senaPlate: z
    .string()
    .min(1, "La placa SENA es requerida"),

  serial: z
    .string()
    .min(3, "El serial debe tener mínimo 3 caracteres")
    .max(50, "El serial es demasiado largo"),

  materialName: z
    .string()
    .min(3, "El nombre del material debe tener mínimo 3 caracteres")
    .max(100, "El nombre del material es demasiado largo"),

  model: z
    .string()
    .min(2, "El modelo debe tener mínimo 2 caracteres")
    .max(50, "El modelo es demasiado largo"),

  unitValue: z
    .number({
      invalid_type_error: "El valor unitario debe ser un número",
    })
    .min(0, "El valor unitario no puede ser negativo"),

  custodian: z
    .string()
    .min(3, "El cuentadante debe tener mínimo 3 caracteres")
    .max(60, "El cuentadante es demasiado largo"),

  quantity: z
    .number({
      invalid_type_error: "La cantidad debe ser un número",
    })
    .min(1, "La cantidad debe ser al menos 1"),

  status: z
    .string()
    .min(1, "Debe seleccionar un estado"),

  totalValue: z
    .number({
      invalid_type_error: "El valor total debe ser un número",
    })
    .min(0, "El valor total no puede ser negativo"),

  dimensions: z
    .string()
    .min(2, "Las dimensiones deben tener mínimo 2 caracteres")
    .max(50, "Las dimensiones son demasiado largas"),

  description: z
    .string()
    .min(5, "La descripción debe tener mínimo 5 caracteres")
    .max(200, "La descripción es demasiado larga"),

  technicalSheet: z
    .string()
    .min(3, "La ficha técnica debe tener mínimo 3 caracteres")
    .max(100, "La ficha técnica es demasiado larga"),

  location: z
    .string()
    .min(3, "La ubicación debe tener mínimo 3 caracteres")
    .max(100, "La ubicación es demasiado larga"),

  photo: z
    .any()
    .optional(), // puedes validar tipo de archivo si lo deseas
});
