import { z } from "zod";
import { fileSchema } from "@/shared";

export const returnablematerialSchema = z.object({

  materialToolId: z
    .string()
    .min(1, "El ID de la herramienta es requerido"),

  materialSenaPlate: z
    .string()
    .min(1, "La placa SENA es requerida"),

  materialCategory: z
    .string()
    .min(1, "La categoría es obligatoria"),

  materialSerial: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 3 && val.length <= 50),
      {
        message: "El serial debe tener entre 3 y 50 caracteres",
      }
    ),

  materialName: z
    .string()
    .min(3, "El nombre del material debe tener mínimo 3 caracteres")
    .max(100, "El nombre del material es demasiado largo"),

  materialModel: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 2 && val.length <= 50),
      {
        message: "El modelo debe tener entre 2 y 50 caracteres",
      }
    ),

  materialUnitValue: z
    .number({
      invalid_type_error: "El valor unitario debe ser un número",
    })
    .min(0, "El valor unitario no puede ser negativo"),

  materialCustodian: z
    .string()
    .min(3, "El cuentadante debe tener mínimo 3 caracteres")
    .max(60, "El cuentadante es demasiado largo"),

  materialQuantity: z
    .number({
      invalid_type_error: "La cantidad debe ser un número",
    })
    .min(1, "La cantidad debe ser al menos 1"),

  materialStatus: z
    .string()
    .min(1, "Debe seleccionar un estado"),

  materialTotalValue: z
    .number({
      invalid_type_error: "El valor total debe ser un número",
    })
    .min(0, "El valor total no puede ser negativo"),

  materialDimensions: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 2 && val.length <= 50),
      {
        message: "Las dimensiones deben tener entre 2 y 50 caracteres",
      }
    ),

  materialDescription: z
    .string()
    .min(5, "La descripción debe tener mínimo 5 caracteres")
    .max(200, "La descripción es demasiado larga"),

  materialTechnicalSheet: fileSchema.shape.files
    .or(z.array(z.instanceof(File)).max(0)),

  materialLocation: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 3 && val.length <= 100),
      {
        message: "La ubicación debe tener entre 3 y 100 caracteres",
      }
    ),

  photo: fileSchema.shape.files.or(z.array(z.instanceof(File)).max(0)),

  brandId: z
    .number({ invalid_type_error: "La marca es requerida" }).optional()

});
