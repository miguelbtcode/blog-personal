import { z } from "zod";
import {
  idSchema,
  emailSchema,
  urlSchema,
  paginationSchema,
  sortOrderSchema,
} from "./shared.schemas";

export const roleSchema = z.enum(["USER", "ADMIN"]);

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre es muy largo"),

  email: emailSchema,

  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña es muy larga"),

  role: roleSchema.default("USER"),
});

export const updateUserSchema = z.object({
  id: idSchema,
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre es muy largo")
    .optional(),

  email: emailSchema.optional(),

  bio: z.string().max(500, "La biografía es muy larga").optional(),

  avatar: urlSchema,

  website: urlSchema,

  twitter: z
    .string()
    .regex(/^@?[A-Za-z0-9_]{1,15}$/, "Usuario de Twitter inválido")
    .optional(),

  github: z
    .string()
    .regex(/^[A-Za-z0-9_-]{1,39}$/, "Usuario de GitHub inválido")
    .optional(),

  role: roleSchema.optional(),
});

export const userFiltersSchema = paginationSchema.extend({
  role: roleSchema.optional(),
  search: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  sortBy: z
    .enum(["name", "email", "createdAt", "postCount"])
    .default("createdAt"),
  sortOrder: sortOrderSchema,
});

// Tipos inferidos
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserFiltersInput = z.infer<typeof userFiltersSchema>;
