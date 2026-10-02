import { z } from "zod";

export const categorySchema = z.object({
    categoryName: z
        .string()
        .min(2, "El nombre de la categoría debe tener mínimo 2 caracteres")
        .max(50, "El nombre de la categoría es demasiado largo"),
});
