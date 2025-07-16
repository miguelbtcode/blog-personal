import { z } from "zod";

// Esquemas compartidos
export const idSchema = z.string().cuid("ID inválido");

export const slugSchema = z
  .string()
  .min(1, "El slug es requerido")
  .max(100, "El slug es muy largo")
  .regex(
    /^[a-z0-9-]+$/,
    "El slug solo puede contener letras minúsculas, números y guiones"
  );

export const emailSchema = z.string().email("Email inválido");

export const urlSchema = z.string().url("URL inválida").optional();

export const paginationSchema = z.object({
  page: z.coerce.number().min(1, "La página debe ser mayor a 0").default(1),
  limit: z.coerce
    .number()
    .min(1)
    .max(100, "El límite máximo es 100")
    .default(10),
});

export const sortOrderSchema = z.enum(["asc", "desc"]).default("desc");
