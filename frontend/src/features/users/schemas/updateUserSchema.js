import { z } from "zod";

export const updateUserSchema = z.object({
    userName: z
        .string()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(60),

    userLastname: z
        .string()
        .min(3, "El apellido debe tener mínimo 3 caracteres")
        .max(60),

    userDocumentType: z
        .string()
        .min(1, "El tipo de documento es obligatorio"),

    userDocumentNumber: z
        .string()
        .min(1, "El número de documento es obligatorio"),

    groupId: z
        .string()
        .optional(),

    userStartDate: z
        .string()
        .optional(), // 👈 opcional en update

    userEndDate: z
        .string()
        .optional(),   // 👈 opcional en update

    userEmail: z
        .string()
        .email("Correo inválido"),

    userAddress: z
        .string()
        .optional(),

    userPhone: z
        .string()
        .optional(),

    userStatus: z
        .string()
        .min(1, "El estado es obligatorio"),

    userPassword: z.union([z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"), z.literal("")]),
    userPhoto: z
        .any()
        .optional(),
});
