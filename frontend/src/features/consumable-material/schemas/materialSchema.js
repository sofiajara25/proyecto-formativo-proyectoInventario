import { z } from "zod";
import { fileSchema } from "@/shared";


export const materialSchema = z.object({

  materialAccountant: z
    .string()
    .min(3, "El cuentadante debe tener mínimo 3 caracteres")
    .max(60, "El cuentadante es demasiado largo"),

  // materialToolId ya no se valida ni se envía: el backend lo genera
  // automáticamente al crear el registro.

  materialSenaPlate: z
    .string()
    .optional(),

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

  inventoryNameId: z.string().min(1, "Debe seleccionar un nombre de inventario"),

  materialLocation: z
    .string()
    .optional(),

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

  // Antes esto permitía enviar un arreglo vacío (".or(...max(0))"), así
  // que el formulario dejaba crear el material sin adjuntar nada aunque el
  // asterisco rojo dijera que era obligatorio. Ahora sí se exige mínimo 1.
  materialTechnicalSheet: fileSchema.shape.files,

  photo: fileSchema.shape.files,

  brandId: z
    .number({ invalid_type_error: "La marca es requerida" }).nullable().optional(),

  categoryId: z
    .number({ invalid_type_error: "Debe seleccionar una categoría" })
    .min(1, "Debe seleccionar una categoría"),

  quotationIds: z
    .array(z.number())
    .min(1, "Debe elegir entre 1 y 3 cotizaciones")
    .max(3, "Máximo 3 cotizaciones"),

}).refine((data) => {
  if (!data.materialEntryDate) return false;

  // Parseamos "YYYY-MM-DD" como fecha LOCAL (no UTC).
  // new Date("2026-08-19") interpreta el string como medianoche UTC, y al
  // convertirlo a horario local (ej. Colombia, UTC-5) puede "caer" al día
  // anterior, haciendo que la fecha de hoy parezca anterior a hoy.
  const [year, month, day] = data.materialEntryDate.split("-").map(Number);
  const materialEntryDate = new Date(year, (month || 1) - 1, day || 1);
  if (isNaN(materialEntryDate.getTime())) return false; // fecha inválida

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  materialEntryDate.setHours(0, 0, 0, 0);

  return materialEntryDate >= today;
}, { path: ["materialEntryDate"], message: "La fecha de ingreso no puede ser anterior a hoy" })
