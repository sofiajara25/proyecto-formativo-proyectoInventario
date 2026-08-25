import { z } from "zod";
import { fileSchema } from "@/shared";

export const loanSchema = z.object({

  isUserRegistered: z.boolean().optional(),

  // Requerido solo si el usuario NO está registrado (ver .superRefine más
  // abajo): si está registrado, el correo se autocompleta solo y puede
  // venir vacío si el usuario elegido no tiene correo guardado.
  signerEmail: z
    .string()
    .email("Correo electrónico inválido")
    .optional()
    .or(z.literal("")),

  loanMaterialType: z
    .string()
    .min(1, "Debe seleccionar un tipo de material"),

  loanUser: z
    .string()
    .min(3, "El usuario debe tener mínimo 3 caracteres")
    .max(60, "El usuario es demasiado largo"),

  loanUserIdentification: z
    .string()
    .min(5, "La identificación del usuario debe tener al menos 5 caracteres")
    .max(150, "La identificación del usuario es demasiado larga"),

  loanApprenticeGroup: z
    .string()
    .max(50, "El grupo del aprendiz es demasiado largo")
    .optional(),

  // El formulario maneja los materiales del préstamo como un arreglo (se
  // pueden agregar/quitar varios), no como campos sueltos.
  materials: z
    .array(
      z.object({
        id: z.string().optional(),
        // id del material real (returnable_materials o consumable_materials,
        // según loanMaterialType) del que sale esta unidad. Se usa en el
        // backend para descontar/restaurar existencias automáticamente.
        materialId: z.union([z.string(), z.number()]).optional(),
        loanCategory: z.string().min(1, "Debe seleccionar una categoría"),
        loanProductName: z
          .string()
          .min(1, "Debe seleccionar un material"),
        loanQuantity: z.coerce
          .number({ invalid_type_error: "La cantidad debe ser un número" })
          .int("La cantidad debe ser un número entero")
          .min(1, "Debe solicitar al menos 1 unidad"),
      })
    )
    .min(1, "Debe agregar al menos un material"),

  isActive: z.boolean({
    invalid_type_error: "Debe seleccionar un estado",
  }),

  loanDate: z
    .string()
    .min(1, "La fecha de préstamo es requerida"),

  loanReturnDate: z
    .string()
    .min(1, "La fecha de devolución es requerida"),

  loanDescription: z
    .string()
    .min(5, "La descripción debe tener mínimo 5 caracteres")
    .max(200, "La descripción es demasiado larga"),

  loanType: z
    .string()
    .min(1, "Debe seleccionar un prestamo"),

  // Cada elemento puede ser un File nuevo (el usuario adjuntó otra foto) o
  // un string con la ruta que ya venía del backend (no se tocó el campo y
  // se conserva la foto actual, esto ocurre al editar un préstamo).
  photo: fileSchema.shape.files
    .or(z.array(z.union([z.instanceof(File), z.string()])).max(12))
    .optional()
}).superRefine((data, ctx) => {
  // Si la persona no está registrada, el correo para la firma es
  // obligatorio (es la única forma de mandarle el enlace de aceptación).
  if (data.isUserRegistered === false && !data.signerEmail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["signerEmail"],
      message: "El correo es obligatorio si el usuario no está registrado",
    });
  }
});