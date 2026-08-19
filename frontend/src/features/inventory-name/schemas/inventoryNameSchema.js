import { z } from "zod";

export const inventoryNameSchema = z.object({
  inventoryName: z
    .string()
    .min(2, "El nombre del inventario debe tener mínimo 2 caracteres")
    .max(50, "El nombre del inventario es demasiado largo"),
});
