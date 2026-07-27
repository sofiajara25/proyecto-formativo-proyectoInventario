import { z } from "zod";

export const taskSchema = (userStartDate, userEndDate) =>
    z.object({
        taskName: z.string().min(3, "El nombre debe tener mínimo 3 caracteres").max(60),
        taskDescription: z.string().min(5, "La descripción debe tener mínimo 5 caracteres").max(200),
        taskDeliveryDate: z.string().min(1, "La fecha de entrega es requerida"),
        taskCreationDate: z.string().min(1, "La fecha de inicio es requerida"),
    })
        .refine((data) => new Date(data.taskCreationDate) >= new Date(userStartDate), {
            message: "La fecha de creación no puede ser antes de la fecha de inicio del usuario",
            path: ["taskCreationDate"],
        })
        .refine((data) => {
            const delivery = new Date(data.taskDeliveryDate);
            const end = new Date(userEndDate);
            return delivery instanceof Date && !isNaN(delivery) && delivery <= end;
        }, {
            message: "La fecha de entrega no puede ser después de la fecha de finalización del usuario",
            path: ["taskDeliveryDate"],
        });

