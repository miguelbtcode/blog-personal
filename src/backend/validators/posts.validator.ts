import { z } from "zod";
import { PostStatus } from "@/shared/enums";

export const postQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  status: z.nativeEnum(PostStatus).optional(),
  authorId: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(200, "El título es muy largo"),
  content: z.string().min(1, "El contenido es requerido"),
  excerpt: z
    .string()
    .min(1, "El resumen es requerido")
    .max(500, "El resumen es muy largo"),
  featuredImage: z.string().url("La imagen debe ser una URL válida"),
  status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
  authorId: z.string().min(1, "El autor es requerido"),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  seoTitle: z.string().max(60, "El título SEO es muy largo").optional(),
  seoDescription: z
    .string()
    .max(160, "La descripción SEO es muy larga")
    .optional(),
});

export const updatePostSchema = createPostSchema.partial();

export type PostQueryParams = z.infer<typeof postQuerySchema>;
export type CreatePostData = z.infer<typeof createPostSchema>;
export type UpdatePostData = z.infer<typeof updatePostSchema>;
