import { NextRequest } from "next/server";
import { ZodSchema, ZodError } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Middleware para validar requests usando schemas de Zod
 */
export function validateRequest<T>(schema: ZodSchema<T>) {
  return async (request: NextRequest): Promise<T> => {
    try {
      // Obtener y validar sesión
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        throw new ValidationError("Usuario no autenticado", 401);
      }

      // Obtener body del request
      const body = await request.json();

      // Validar con el schema
      const validatedData = schema.parse(body);

      return validatedData;
    } catch (error) {
      if (error instanceof ZodError) {
        // Errores de validación de Zod
        const firstError = error.issues[0];
        const message = `${firstError?.path.join(".")}: ${firstError?.message}`;
        throw new ValidationError(message, 400);
      }

      if (error instanceof ValidationError) {
        throw error;
      }

      // Error genérico
      throw new ValidationError("Error de validación", 400);
    }
  };
}

/**
 * Clase de error personalizada para validaciones
 */
export class ValidationError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = statusCode;
  }
}

/**
 * Middleware para validar parámetros de URL
 */
export function validateParams<T>(schema: ZodSchema<T>, params: any): T {
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      const message = `Parámetro ${firstError?.path.join(".")}: ${
        firstError?.message
      }`;
      throw new ValidationError(message, 400);
    }
    throw new ValidationError("Parámetros inválidos", 400);
  }
}

/**
 * Middleware para validar query parameters
 */
export function validateQuery<T>(
  schema: ZodSchema<T>,
  searchParams: URLSearchParams
): T {
  try {
    const queryObject: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      queryObject[key] = value;
    });

    return schema.parse(queryObject);
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      const message = `Query ${firstError?.path.join(".")}: ${
        firstError?.message
      }`;
      throw new ValidationError(message, 400);
    }
    throw new ValidationError("Query parameters inválidos", 400);
  }
}
