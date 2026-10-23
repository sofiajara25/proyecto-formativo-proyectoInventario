import { z } from "zod";

// Convierte una fecha a "AAAA-MM-DD" (día local) para comparar solo el
// día, sin horas. Antes se comparaba con new Date(...): la fecha del
// formulario ("2026-10-22") se toma como medianoche UTC, pero la fecha de
// inicio del usuario llega del backend como "2026-10-22T05:00:00.000Z"
// (medianoche en Colombia). Así, el mismo día salía "antes" y no dejaba
// crear la tarea con la fecha de hoy.
export function toDay(value) {
    if (!value) return "";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const date = new Date(value);
    if (isNaN(date)) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * @param {string} userStartDate - Fecha de inicio del usuario asignado.
 * @param {string} userEndDate - Fecha de finalización del usuario asignado.
 * @param {object} [options]
 * @param {boolean} [options.notBeforeToday] - Al crear: la fecha de
 *   creación puede ser hoy, pero no un día anterior. Al editar no se usa,
 *   para no bloquear tareas que se crearon hace días.
 */
export const taskSchema = (userStartDate, userEndDate, { notBeforeToday = false } = {}) =>
    z.object({
        taskName: z.string().min(3, "El nombre debe tener mínimo 3 caracteres").max(60),
        taskDescription: z.string().min(5, "La descripción debe tener mínimo 5 caracteres").max(200),
        taskDeliveryDate: z.string().min(1, "La fecha de entrega es requerida"),
        taskCreationDate: z.string().min(1, "La fecha de inicio es requerida"),
        userId: z.string().min(1, "El usuario es obligatorio"), // 👈 agregado
    })
        .refine((data) => !notBeforeToday || toDay(data.taskCreationDate) >= toDay(new Date()), {
            message: "La fecha de creación no puede ser anterior a hoy",
            path: ["taskCreationDate"],
        })
        .refine((data) => !userStartDate || toDay(data.taskCreationDate) >= toDay(userStartDate), {
            message: "La fecha de creación no puede ser antes de la fecha de inicio del usuario",
            path: ["taskCreationDate"],
        })
        .refine((data) => !userEndDate || toDay(data.taskDeliveryDate) <= toDay(userEndDate), {
            message: "La fecha de entrega no puede ser después de la fecha de finalización del usuario",
            path: ["taskDeliveryDate"],
        })
        .refine((data) => toDay(data.taskCreationDate) <= toDay(data.taskDeliveryDate), {
            message: "La fecha de creación no puede ser posterior a la fecha de entrega",
            path: ["taskCreationDate"],
        });
