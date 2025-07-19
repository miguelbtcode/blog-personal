import { z } from "zod";

// Schema compartido para validaciones de archivo
export const fileValidationSchema = z.object({
  size: z.number().max(5 * 1024 * 1024, "El archivo no puede superar los 5MB"),
  type: z
    .string()
    .refine(
      (type) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(type),
      "Solo se permiten archivos JPG, PNG y WebP"
    ),
  name: z.string().min(1, "El archivo debe tener un nombre"),
});

// Schema para el cliente (con File object)
export const uploadImageClientSchema = z.object({
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

// Schema para respuestas del servidor
export const uploadResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    url: z.string().url("URL inválida"),
    publicId: z.string().min(1, "Public ID requerido"),
  }),
  message: z.string().optional(),
});

// Schema para eliminar imagen
export const deleteImageSchema = z.object({
  publicId: z.string().min(1, "Public ID es requerido"),
});

// Tipos inferidos
export type FileValidationInput = z.infer<typeof fileValidationSchema>;
export type UploadImageClientInput = z.infer<typeof uploadImageClientSchema>;
export type UploadResponseData = z.infer<typeof uploadResponseSchema>;
export type DeleteImageInput = z.infer<typeof deleteImageSchema>;
