import { z } from "zod";
import { fileSchema } from "@/shared";

export const updateReturnableSchema = z.object({
    materialToolId: z
        .string()
        .min(1, "El ID de la herramienta es requerido")
        .optional(),

    materialSenaPlate: z
        .string()
        .min(1, "La placa SENA es requerida")
        .optional(),

    materialCategory: z
        .string()
        .min(1, "La categoría es obligatoria")
        .optional(),

    materialSerial: z
        .string()
        .min(3, "El serial debe tener mínimo 3 caracteres")
        .max(50, "El serial es demasiado largo")
        .optional(),

    materialName: z
        .string()
        .min(3, "El nombre del material debe tener mínimo 3 caracteres")
        .max(100, "El nombre del material es demasiado largo")
        .optional(),

    materialModel: z
        .string()
        .min(2, "El modelo debe tener mínimo 2 caracteres")
        .max(50, "El modelo es demasiado largo")
        .optional(),

    materialUnitValue: z
        .number({
            invalid_type_error: "El valor unitario debe ser un número",
        })
        .min(0, "El valor unitario no puede ser negativo")
        .optional(),

    materialCustodian: z
        .string()
        .min(3, "El cuentadante debe tener mínimo 3 caracteres")
        .max(60, "El cuentadante es demasiado largo")
        .optional(),

    materialQuantity: z
        .number({
            invalid_type_error: "La cantidad debe ser un número",
        })
        .min(1, "La cantidad debe ser al menos 1")
        .optional(),

    materialStatus: z
        .string()
        .min(1, "Debe seleccionar un estado")
        .optional(),

    materialTotalValue: z
        .number({
            invalid_type_error: "El valor total debe ser un número",
        })
        .min(0, "El valor total no puede ser negativo")
        .optional(),

    materialDimensions: z
        .string()
        .min(2, "Las dimensiones deben tener mínimo 2 caracteres")
        .max(50, "Las dimensiones son demasiado largas")
        .optional(),

    materialDescription: z
        .string()
        .min(5, "La descripción debe tener mínimo 5 caracteres")
        .max(200, "La descripción es demasiado larga")
        .optional(),

    materialTechnicalSheet: fileSchema.shape.files
        .or(z.array(z.instanceof(File)).max(1))
        .optional(),

    materialLocation: z
        .string()
        .min(3, "La ubicación debe tener mínimo 3 caracteres")
        .max(100, "La ubicación es demasiado larga")
        .optional(),

    photo: fileSchema.shape.files.or(z.array(z.instanceof(File)).max(0)).optional(),

    brandId: z
        .number({ invalid_type_error: "La marca es requerida" })
        .optional(),
});
