import { z } from "zod";

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
        .refine(
            (val) => !val || (val.length >= 3 && val.length <= 50),
            {
                message: "El serial debe tener entre 3 y 50 caracteres",
            }
        )
        .optional(),

    materialName: z
        .string()
        .min(3, "El nombre del material debe tener mínimo 3 caracteres")
        .max(100, "El nombre del material es demasiado largo")
        .optional(),

    materialModel: z
        .string()
        .refine(
            (val) => !val || (val.length >= 2 && val.length <= 50),
            {
                message: "El modelo debe tener entre 2 y 50 caracteres",
            }
        )
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
        .refine(
            (val) => !val || (val.length >= 2 && val.length <= 50),
            {
                message: "Las dimensiones deben tener entre 2 y 50 caracteres",
            }
        )
        .optional(),

    materialDescription: z
        .string()
        .min(5, "La descripción debe tener mínimo 5 caracteres")
        .max(200, "La descripción es demasiado larga")
        .optional(),

    // Cada elemento puede ser un File nuevo (el usuario adjuntó otro archivo)
    // o un string con la ruta que ya venía del backend (el usuario no tocó
    // el campo y se conserva el archivo/foto actual).
    materialTechnicalSheet: z
        .array(z.union([z.instanceof(File), z.string()]))
        .max(1)
        .optional(),

    inventoryNameId: z.string().min(1, "Debe seleccionar un nombre de inventario"),

    materialLocation: z
        .string()
        .refine(
            (val) => !val || (val.length >= 3 && val.length <= 100),
            {
                message: "La ubicación debe tener entre 3 y 100 caracteres",
            }
        )
        .optional(),

    photo: z
        .array(z.union([z.instanceof(File), z.string()]))
        .max(12)
        .optional(),

    brandId: z
        .number({ invalid_type_error: "La marca es requerida" })
        .nullable()
        .optional(),
});
