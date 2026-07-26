import { z } from "zod";
import { fileSchema } from "@/shared";


export const materialSchema = z.object({

  materialAccountant: z
    .string()
    .min(3, "El cuentadante debe tener mínimo 3 caracteres")
    .max(60, "El cuentadante es demasiado largo"),

  materialToolId: z
    .string()
    .min(1, "El ID de la herramienta es requerido"),

  materialSenaPlate: z
    .string()
    .min(1, "La placa SENA es requerida"),

  materialName: z
    .string()
    .min(3, "El nombre del material debe tener mínimo 3 caracteres")
    .max(100, "El nombre del material es demasiado largo"),

  materialEntryDate: z
    .string()
    .min(1, "La fecha de ingreso es requerida"),

  materialQuantity: z
    .number({
      invalid_type_error: "La cantidad debe ser un número",
    })
    .min(1, "La cantidad debe ser al menos 1"),

  materialLocation: z
    .string()
    .min(3, "La ubicación debe tener mínimo 3 caracteres")
    .max(100, "La ubicación es demasiado larga"),

  materialUnitValue: z
    .number({
      invalid_type_error: "El valor unitario debe ser un número",
    })
    .min(0, "El valor unitario no puede ser negativo"),

  materialTotalValue: z
    .number({
      invalid_type_error: "El valor total debe ser un número",
    })
    .min(0, "El valor total no puede ser negativo"),

  materialStatus: z
    .string()
    .min(1, "Debe seleccionar un estado"),

  materialDescription: z
    .string()
    .min(5, "La descripción debe tener mínimo 5 caracteres")
    .max(200, "La descripción es demasiado larga"),

  photo: fileSchema.shape.files.or(z.array(z.instanceof(File)).max(0)).optional()
}).refine((data) => {
  if (!data.materialEntryDate) return false;
  const today = new Date();
  const materialEntryDate = new Date(data.materialEntryDate);
  if (isNaN(materialEntryDate.getTime())) return false; // fecha inválida
  today.setHours(0, 0, 0, 0);
  materialEntryDate.setHours(0, 0, 0, 0);
  return materialEntryDate >= today;
}, { path: ["materialEntryDate"], message: "La fecha de préstamo no puede ser anterior a hoy" })
