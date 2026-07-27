import { z } from "zod";

// Formulario donde el usuario pide el enlace de recuperación
export const forgotPasswordSchema = z.object({
    userEmail: z.email("Debe ingresar un email valido"),
});

// Formulario donde el usuario ingresa el código de 6 dígitos recibido por correo
export const verifyCodeSchema = z.object({
    code: z
        .string()
        .length(6, "El código debe tener 6 dígitos")
        .regex(/^\d{6}$/, "El código solo debe contener números"),
});

// Formulario donde el usuario define su nueva contraseña
export const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
        confirmPassword: z.string().min(8, "Debe confirmar la contraseña"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });