import { z } from "zod";

export const brandSchema = z.object({
  marca: z
    .string()
    .min(2, "El nombre de la marca debe tener mínimo 2 caracteres")
    .max(50, "El nombre de la marca es demasiado largo"),
});
