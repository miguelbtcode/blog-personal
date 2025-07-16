import { z } from "zod";
import {
  idSchema,
  slugSchema,
  paginationSchema,
  sortOrderSchema,
} from "./shared.schemas";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre es muy largo"),

  slug: slugSchema,

  description: z.string().max(500, "La descripción es muy larga").optional(),

  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color hexadecimal inválido")
    .optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: idSchema,
});

export const categoryFiltersSchema = paginationSchema.extend({
  search: z.string().optional(),
  sortBy: z.enum(["name", "createdAt", "postCount"]).default("name"),
  sortOrder: sortOrderSchema,
});

// Tipos inferidos
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryFiltersInput = z.infer<typeof categoryFiltersSchema>;
