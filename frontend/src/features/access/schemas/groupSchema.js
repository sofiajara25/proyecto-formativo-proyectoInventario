import { z } from "zod";

export const groupSchema = z.object({
  group_name: z.string().min(3, "El nombre del grupo debe tener al menos 3 caracteres"),
});
