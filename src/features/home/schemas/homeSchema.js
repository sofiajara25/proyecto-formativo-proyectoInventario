import { z } from "zod";

export const homeSchema = z.object({
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar un correo válido"),

  password: z
    .string()
    .min(6, "La contraseña debe tener mínimo 6 caracteres"),
});
