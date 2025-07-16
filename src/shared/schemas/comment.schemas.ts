import { z } from "zod";
import {
  idSchema,
  emailSchema,
  paginationSchema,
  sortOrderSchema,
} from "./shared.schemas";

export const commentStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SPAM",
]);

export const createCommentSchema = z
  .object({
    content: z
      .string()
      .min(1, "El comentario es requerido")
      .max(1000, "El comentario es muy largo"),

    postId: idSchema,

    authorId: idSchema.optional(),

    parentId: idSchema.optional(),

    guestName: z
      .string()
      .min(1, "El nombre es requerido")
      .max(50, "El nombre es muy largo")
      .optional(),

    guestEmail: emailSchema.optional(),
  })
  .refine((data) => data.authorId || (data.guestName && data.guestEmail), {
    message: "Se requiere un usuario autenticado o datos de invitado",
    path: ["authorId"],
  });

export const updateCommentSchema = createCommentSchema.partial().extend({
  id: idSchema,
  status: commentStatusSchema.optional(),
});

export const commentFiltersSchema = paginationSchema.extend({
  postId: idSchema.optional(),
  status: commentStatusSchema.optional(),
  authorId: idSchema.optional(),
  search: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "content"]).default("createdAt"),
  sortOrder: sortOrderSchema,
});

// Tipos inferidos
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CommentFiltersInput = z.infer<typeof commentFiltersSchema>;
