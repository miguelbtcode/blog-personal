import { z } from "zod";

// Validaciones para Posts
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(200, "El título no puede superar los 200 caracteres"),

  content: z
    .string()
    .min(1, "El contenido es requerido")
    .max(50000, "El contenido es demasiado largo"),

  excerpt: z
    .string()
    .max(500, "El excerpt no puede superar los 500 caracteres")
    .optional(),

  featuredImage: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal("")),

  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    errorMap: () => ({ message: "Estado inválido" }),
  }),

  categoryIds: z.array(z.string().cuid("ID de categoría inválido")).optional(),

  tagIds: z.array(z.string().cuid("ID de tag inválido")).optional(),

  seoTitle: z
    .string()
    .max(60, "El título SEO no puede superar los 60 caracteres")
    .optional(),

  seoDescription: z
    .string()
    .max(160, "La descripción SEO no puede superar los 160 caracteres")
    .optional(),
});

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.string().cuid("ID de post inválido"),
});

// Validaciones para Categorías
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre no puede superar los 50 caracteres"),

  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(50, "El slug no puede superar los 50 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),

  description: z
    .string()
    .max(500, "La descripción no puede superar los 500 caracteres")
    .optional(),

  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Debe ser un color hexadecimal válido")
    .optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string().cuid("ID de categoría inválido"),
});

// Validaciones para Tags
export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(30, "El nombre no puede superar los 30 caracteres"),

  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(30, "El slug no puede superar los 30 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),
});

export const updateTagSchema = createTagSchema.partial().extend({
  id: z.string().cuid("ID de tag inválido"),
});

// Validaciones para Comentarios
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "El comentario es requerido")
    .max(1000, "El comentario no puede superar los 1000 caracteres"),

  postId: z.string().cuid("ID de post inválido"),

  parentId: z.string().cuid("ID de comentario padre inválido").optional(),

  // Para comentarios de invitados
  guestName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres")
    .optional(),

  guestEmail: z.string().email("Email inválido").optional(),
});

export const updateCommentSchema = z.object({
  id: z.string().cuid("ID de comentario inválido"),

  content: z
    .string()
    .min(1, "El comentario es requerido")
    .max(1000, "El comentario no puede superar los 1000 caracteres")
    .optional(),

  status: z
    .enum(["PENDING", "APPROVED", "REJECTED", "SPAM"], {
      errorMap: () => ({ message: "Estado inválido" }),
    })
    .optional(),
});

// Validaciones para usuarios
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres")
    .optional(),

  bio: z
    .string()
    .max(500, "La biografía no puede superar los 500 caracteres")
    .optional(),

  image: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
});

// Validaciones para filtros y paginación
export const postFiltersSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  categoryId: z.string().cuid().optional(),
  tagId: z.string().cuid().optional(),
  authorId: z.string().cuid().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum(["createdAt", "updatedAt", "publishedAt", "title", "viewCount"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const commentFiltersSchema = z.object({
  postId: z.string().cuid().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "SPAM"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Validaciones para formularios de contacto
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),

  email: z.string().email("Email inválido"),

  subject: z
    .string()
    .min(1, "El asunto es requerido")
    .max(100, "El asunto no puede superar los 100 caracteres"),

  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "El mensaje no puede superar los 1000 caracteres"),
});

// Validaciones para newsletter
export const newsletterSchema = z.object({
  email: z.string().email("Email inválido"),
});

// Validaciones para upload de archivos
export const uploadImageSchema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File, "Debe ser un archivo válido")
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
});

// Tipos inferidos de los esquemas
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type PostFiltersInput = z.infer<typeof postFiltersSchema>;
export type CommentFiltersInput = z.infer<typeof commentFiltersSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type UploadImageInput = z.infer<typeof uploadImageSchema>;
