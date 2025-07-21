// shared/schemas/post.schemas.ts
import { z } from "zod";
import { idSchema, paginationSchema, sortOrderSchema } from "./shared.schemas";
import { PostStatus } from "@/shared/enums";

export const postStatusSchema = z.nativeEnum(PostStatus).optional();

// Schema para crear posts (usado en el backend)
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(200, "El título es muy largo"),

  content: z.any().refine((content) => {
    // Validar que sea un objeto válido con estructura de post
    return content && typeof content === "object";
  }, "El contenido debe tener un formato válido"),

  excerpt: z
    .string()
    .max(500, "El extracto es muy largo")
    .optional()
    .default(""),

  featuredImage: z
    .string()
    .url("URL de imagen inválida")
    .optional()
    .or(z.literal("")),

  status: postStatusSchema.default(PostStatus.DRAFT),

  categoryIds: z.array(idSchema).optional().default([]),

  tagIds: z.array(idSchema).optional().default([]),

  seoTitle: z.string().max(60, "El título SEO es muy largo").optional(),

  seoDescription: z
    .string()
    .max(160, "La descripción SEO es muy larga")
    .optional(),

  publishedAt: z.date().nullable().optional(),
});

// Schema para actualizar posts
export const updatePostSchema = createPostSchema.partial().extend({
  id: idSchema,
});

// Schema para filtros de posts
export const postFiltersSchema = paginationSchema.extend({
  status: postStatusSchema.optional(),
  category: idSchema.optional(),
  tag: idSchema.optional(),
  search: z.string().optional(),

  isAdmin: z.coerce.boolean().default(false).optional(),

  // Sorting
  sortBy: z
    .enum(["createdAt", "updatedAt", "publishedAt", "title", "viewCount"])
    .default("createdAt"),
  sortOrder: sortOrderSchema,
});

// Schema para validar parámetros de ruta
export const postParamsSchema = z.object({
  id: idSchema,
});

export const postSlugParamsSchema = z.object({
  slug: z.string().min(1, "Slug es requerido"),
});

// Tipos inferidos
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostFiltersInput = z.infer<typeof postFiltersSchema>;
export type PostParamsInput = z.infer<typeof postParamsSchema>;
export type PostSlugParamsInput = z.infer<typeof postSlugParamsSchema>;
