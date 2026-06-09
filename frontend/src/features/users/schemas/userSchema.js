import { z } from "zod";
import { fileSchema } from "@/shared";

export const userSchema = z.object({

    userName: z
        .string()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(60, "El nombre es demasiado largo"),

    userDocumentType: z
        .string()
        .min(1, "Debe seleccionar un tipo de documento"),

    userDocumentNumber: z
        .string()
        .min(5, "Número de documento inválido")
        .max(20, "Número de documento demasiado largo"),

    userType: z
        .string()
        .min(1, "Debe seleccionar un tipo de usuario"),

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
})