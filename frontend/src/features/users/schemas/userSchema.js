import { z } from "zod";
import { fileSchema } from "@/shared";

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
        .max(100, "La dirección es demasiado larga"),

    userPhone: z
        .string()
        .regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),

    userStatus: z
        .string()
        .min(1, "Debe seleccionar un estado"),

    userPassword: z
        .string()
        .min(8, "Contraseña debe tener mínimo 8 caracteres ")
        .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        .regex(/[a-z]/, "Debe contener al menos una minúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),


    userPhoto: fileSchema.shape.files.or(z.array(z.instanceof(File)).max(0)).optional()
}).refine((data) => {
    if (!data.userStartDate) return false;
    const today = new Date();
    const userStartDate = new Date(data.userStartDate);
    if (isNaN(userStartDate.getTime())) return false; // fecha inválida
    today.setHours(0, 0, 0, 0);
    userStartDate.setHours(0, 0, 0, 0);
    return userStartDate >= today;
}, { path: ["userStartDate"], message: "La fecha de inicio no puede ser anterior a hoy" })
    .refine((data) => {
        if (!data.userStartDate || !data.userEndDate) return false;
        const userStartDate = new Date(data.userStartDate);
        const returnDate = new Date(data.userEndDate);
        if (isNaN(userStartDate.getTime()) || isNaN(returnDate.getTime())) return false; // fechas inválidas
        userStartDate.setHours(0, 0, 0, 0);
        returnDate.setHours(0, 0, 0, 0);
        return returnDate >= userStartDate;
    }, { path: ["userEndDate"], message: "La fecha de finalización no puede ser anterior a la fecha de inicio" });