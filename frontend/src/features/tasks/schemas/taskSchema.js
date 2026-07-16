import { z } from "zod";

export const taskSchema = z.object({

    taskName: z
        .string()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(60, "El nombre es demasiado largo"),

    taskDescription: z
        .string()
        .min(5, "La descripción debe tener mínimo 5 caracteres")
        .max(200, "La descripción es demasiado larga"),


    taskDeliveryDate: z
        .string()
        .min(1, "La fecha de entrega es requerida"),

    taskCreationDate: z
        .string()
        .min(1, "La fecha de inicio es requerida"),
})