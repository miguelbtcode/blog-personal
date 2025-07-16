import { z } from "zod";
import {
  idSchema,
  slugSchema,
  paginationSchema,
  sortOrderSchema,
} from "./shared.schemas";
import { PostStatus } from "@/shared/enums";

export const postStatusSchema = z.nativeEnum(PostStatus).optional();

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(200, "El título es muy largo"),

  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),

  excerpt: z
    .string()
    .nonempty("El extracto es requerido")
    .max(500, "El extracto es muy largo"),

  featuredImage: z
    .string()
    .nonempty("La imagen destacada es requerida")
    .url("URL de imagen inválida"),

  status: postStatusSchema.default(PostStatus.DRAFT),

  categoryIds: z.array(idSchema).optional(),

  tagIds: z.array(idSchema).optional(),

  seoTitle: z.string().max(60, "El título SEO es muy largo").optional(),

  seoDescription: z
    .string()
    .max(160, "La descripción SEO es muy larga")
    .optional(),

  publishedAt: z.string().datetime().optional(),
});

export const updatePostSchema = createPostSchema.partial().extend({
  id: idSchema,
});

export const postFiltersSchema = paginationSchema.extend({
  status: postStatusSchema.optional(),
  categoryId: idSchema.optional(),
  tagId: idSchema.optional(),
  authorId: idSchema.optional(),
  search: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "publishedAt", "title", "viewCount"])
    .default("createdAt"),
  sortOrder: sortOrderSchema,
});
