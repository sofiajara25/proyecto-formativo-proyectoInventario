import { z } from "zod";
import { singleFileSchema } from "@/shared";

function parseLocalDate(value) {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, (month || 1) - 1, day || 1);
    return Number.isNaN(date.getTime()) ? null : date;
}

export const userSchema = z.object({
    userName: z
        .string()
        .min(3, "El nombre debe tener minimo 3 caracteres")
        .max(60, "El nombre es demasiado largo"),

    userLastname: z
        .string()
        .min(3, "El apellido debe tener minimo 3 caracteres")
        .max(60, "El apellido es demasiado largo"),

    userDocumentType: z
        .string()
        .min(1, "Debe seleccionar un tipo de documento"),

    userDocumentNumber: z
        .string()
        .min(5, "Numero de documento invalido")
        .max(20, "Numero de documento demasiado largo"),

    groupId: z.string().min(1, "Debe seleccionar un grupo"),

    userEndDate: z
        .string()
        .min(1, "La fecha de finalizacion es requerida"),

    userStartDate: z
        .string()
        .min(1, "La fecha de inicio es requerida"),

    userEmail: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar un email valido"),

    userAddress: z
        .string()
        .max(100, "La direccion es demasiado larga")
        .optional()
        .or(z.literal("")),

    userPhone: z
        .string()
        .regex(/^[0-9]{10}$/, "El telefono debe tener 10 digitos")
        .optional()
        .or(z.literal("")),

    userStatus: z
        .string()
        .min(1, "Debe seleccionar un estado"),

    userPhoto: singleFileSchema.optional(),

    isSuperAdmin: z.boolean().optional(),
}).refine((data) => {
    const start = parseLocalDate(data.userStartDate);
    if (!start) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    return start.getTime() >= today.getTime();
}, { path: ["userStartDate"], message: "La fecha de inicio no puede ser anterior a hoy" })
    .refine((data) => {
        const start = parseLocalDate(data.userStartDate);
        const end = parseLocalDate(data.userEndDate);
        if (!start || !end) return false;

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        return end >= start;
    }, { path: ["userEndDate"], message: "La fecha de finalizacion no puede ser anterior a la fecha de inicio" });
