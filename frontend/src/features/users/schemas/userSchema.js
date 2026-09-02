import { z } from "zod";
import { singleFileSchema } from "@/shared";

export const userSchema = z.object({

    userName: z
        .string()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(60, "El nombre es demasiado largo"),

    userLastname: z
        .string()
        .min(3, "El apellido debe tener mínimo 3 caracteres")
        .max(60, "El apellido es demasiado largo"),

    userDocumentType: z
        .string()
        .min(1, "Debe seleccionar un tipo de documento"),

    userDocumentNumber: z
        .string()
        .min(5, "Número de documento inválido")
        .max(20, "Número de documento demasiado largo"),

    groupId: z.string().min(1, "Debe seleccionar un grupo"),

    userEndDate: z
        .string()
        .min(1, "La fecha de finalización es requerida"),

    userStartDate: z
        .string()
        .min(1, "La fecha de inicio es requerida"),

    userEmail: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar un email válido"),

    userAddress: z
        .string()
        .min(5, "La dirección debe tener mínimo 5 caracteres")
        .max(100, "La dirección es demasiado larga")
        .optional(),

    userPhone: z
        .string()
        .regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos")
        .optional(),

    userStatus: z
        .string()
        .min(1, "Debe seleccionar un estado"),

    // La contraseña ya no se pide al crear el usuario: se genera sola en el
    // backend y queda hasheada, sin que nadie pueda verla.

    userPhoto: singleFileSchema.optional(),

    isSuperAdmin: z.boolean().optional(),
}).refine((data) => {
    if (!data.userStartDate) return false;

    // Parseamos "YYYY-MM-DD" como fecha LOCAL (no UTC). new Date(string)
    // interpreta ese formato como medianoche UTC, y al convertirlo a horario
    // local (ej. Colombia, UTC-5) puede "caer" al día anterior, haciendo que
    // la fecha de hoy parezca anterior a hoy.
    const start = parseLocalDate(data.userStartDate);
    if (!start) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    return start.getTime() >= today.getTime(); // 👈 hoy permitido
}, { path: ["userStartDate"], message: "La fecha de inicio no puede ser anterior a hoy" })

    .refine((data) => {
        if (!data.userEndDate) return true; // 👈 si no hay fecha fin, no valida
        const start = parseLocalDate(data.userStartDate);
        const end = parseLocalDate(data.userEndDate);
        if (!start || !end) return false;
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return end >= start;
    }, { path: ["userEndDate"], message: "La fecha de finalización no puede ser anterior a la fecha de inicio" });

// Convierte un string "YYYY-MM-DD" a Date en horario LOCAL (evita el
// corrimiento de un día que produce `new Date("YYYY-MM-DD")`, que lo
// interpreta como UTC).
function parseLocalDate(value) {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, (month || 1) - 1, day || 1);
    return isNaN(date.getTime()) ? null : date;
}
