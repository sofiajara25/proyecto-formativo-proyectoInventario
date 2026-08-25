import { z } from "zod";

export const quotationSchema = z.object({
    quotationName: z
        .string()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(100, "El nombre es demasiado largo"),

    // Un único PDF obligatorio (se guarda como arreglo de 1 elemento para
    // reutilizar el mismo FileInput que usan ficha técnica/fotos).
    pdf: z
        .array(z.instanceof(File))
        .min(1, "El PDF de la cotización es obligatorio")
        .max(1, "Solo se permite un archivo")
        .refine(
            (files) => files.every((f) => f.type === "application/pdf"),
            "El archivo debe ser un PDF"
        ),
});
