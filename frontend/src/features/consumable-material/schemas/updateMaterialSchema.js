import { z } from "zod";

export const updateMaterialSchema = z.object({
    materialAccountants: z
        .array(z.string().min(1))
        .min(1, "Debe agregar al menos un cuentadante"),

    materialToolId: z
        .string()
        .min(1),

    materialSenaPlate: z
        .string()
        .optional(),

    materialName: z
        .string()
        .min(3)
        .max(100),

    materialEntryDate: z
        .string()
        .min(1), // 👈 aquí ya no hacemos refine

    materialPurchaseDate: z
        .string()
        .min(1, "La fecha de compra es obligatoria"),

    materialQuantity: z
        .number({ invalid_type_error: "La cantidad debe ser un número" })
        .min(1),

    inventoryNameId: z.string().min(1, "Debe seleccionar un nombre de inventario"),

    materialLocation: z
        .string()
        .optional(),

    materialUnitValue: z
        .number({ invalid_type_error: "El valor unitario debe ser un número" })
        .min(0),

    materialTotalValue: z
        .number({ invalid_type_error: "El valor total debe ser un número" })
        .min(0),

    materialStatus: z
        .string()
        .min(1),

    materialDescription: z
        .string()
        .min(5)
        .max(200),

    brandId: z
        .number()
        .nullable()
        .optional(),

    categoryId: z
        .number({ invalid_type_error: "Debe seleccionar una categoría" })
        .min(1, "Debe seleccionar una categoría")
        .optional(),

    quotationIds: z
        .array(z.number())
        .min(1, "Debe elegir entre 1 y 3 cotizaciones")
        .max(3, "Máximo 3 cotizaciones"),

    // Cada elemento puede ser un File nuevo (el usuario adjuntó otro archivo)
    // o un string con la ruta que ya venía del backend (el usuario no tocó
    // el campo y se conserva el archivo/foto actual).
    materialTechnicalSheet: z
        .array(z.union([z.instanceof(File), z.string()]))
        .max(1)
        .optional(),

    photo: z
        .array(z.union([z.instanceof(File), z.string()]))
        .max(12)
        .optional()
});
