import { z } from "zod";
import {
  idSchema,
  slugSchema,
  paginationSchema,
  sortOrderSchema,
} from "./shared.schemas";

export const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(30, "El nombre es muy largo"),

  slug: slugSchema,
});

export const updateTagSchema = createTagSchema.partial().extend({
  id: idSchema,
});

export const tagFiltersSchema = paginationSchema.extend({
  search: z.string().optional(),
  sortBy: z.enum(["name", "createdAt", "postCount"]).default("name"),
  sortOrder: sortOrderSchema,
});

// Tipos inferidos
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type TagFiltersInput = z.infer<typeof tagFiltersSchema>;
