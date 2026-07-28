import { z } from "zod";
import { fileSchema } from "@/shared";

export const updateMaterialSchema = z.object({
    materialAccountant: z.string().min(3).max(60),
    materialToolId: z.string().min(1),
    materialSenaPlate: z.string().min(1),
    materialName: z.string().min(3).max(100),
    materialEntryDate: z.string().min(1), // 👈 aquí ya no hacemos refine
    materialQuantity: z.number({ invalid_type_error: "La cantidad debe ser un número" }).min(1),
    materialLocation: z.string().min(3).max(100),
    materialUnitValue: z.number({ invalid_type_error: "El valor unitario debe ser un número" }).min(0),
    materialTotalValue: z.number({ invalid_type_error: "El valor total debe ser un número" }).min(0),
    materialStatus: z.string().min(1),
    materialDescription: z.string().min(5).max(200),
    brandId: z.number().optional(),
    photo: fileSchema.shape.files.or(z.array(z.instanceof(File)).max(0)).optional()
});
