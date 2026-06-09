import { z } from "zod";

export const loginSchema = z.object({
  userEmail: z.email("Debe ingresar un email valido"),

  userPassword: z.string().min(2, "La contraseña es obligatoria"),
});
