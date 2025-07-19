import { z } from "zod";
import { emailSchema } from "./shared.schemas";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre es muy largo"),

  email: emailSchema,

  subject: z
    .string()
    .min(1, "El asunto es requerido")
    .max(100, "El asunto es muy largo"),

  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "El mensaje es muy largo"),
});

export const newsletterSchema = z.object({
  email: emailSchema,
});

export const uploadImageSchema = z.object({
  file: z
    .instanceof(File, { message: "Debe ser un archivo válido" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "El archivo no puede superar los 5MB"
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      "Solo se permiten archivos JPG, PNG y WebP"
    ),

  alt: z.string().max(200, "El texto alternativo es muy largo").optional(),
  caption: z.string().max(500, "El pie de foto es muy largo").optional(),
});

// Tipos inferidos
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type UploadImageInput = z.infer<typeof uploadImageSchema>;
