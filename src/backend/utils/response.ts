// backend/utils/response.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ValidationError } from "../middleware/validation";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export const createResponse = {
  /**
   * Respuesta de éxito
   */
  success<T>(
    data: T,
    message?: string,
    statusCode: number = 200
  ): NextResponse {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };

    return NextResponse.json(response, { status: statusCode });
  },

  /**
   * Respuesta de error
   */
  error(error: unknown, statusCode?: number): NextResponse {
    console.error("API Error:", error);

    let errorMessage = "Error interno del servidor";
    let status = statusCode || 500;

    // Manejar diferentes tipos de errores
    if (error instanceof ValidationError) {
      errorMessage = error.message;
      status = error.statusCode;
    } else if (error instanceof ZodError) {
      const firstError = error.issues[0];
      errorMessage = `${firstError?.path.join(".")}: ${firstError?.message}`;
      status = 400;
    } else if (error instanceof Error) {
      errorMessage = error.message;

      // Errores específicos de base de datos
      if (error.message.includes("Unique constraint")) {
        errorMessage = "El recurso ya existe";
        status = 409;
      } else if (
        error.message.includes("not found") ||
        error.message.includes("no encontrado")
      ) {
        status = 404;
      } else if (
        error.message.includes("no autenticado") ||
        error.message.includes("no autorizado")
      ) {
        status = 401;
      } else if (error.message.includes("permisos")) {
        status = 403;
      }
    }

    const response: ApiResponse = {
      success: false,
      error: errorMessage,
      statusCode: status,
    };

    return NextResponse.json(response, { status });
  },

  /**
   * Respuesta de no encontrado
   */
  notFound(message: string = "Recurso no encontrado"): NextResponse {
    const response: ApiResponse = {
      success: false,
      error: message,
      statusCode: 404,
    };

    return NextResponse.json(response, { status: 404 });
  },

  /**
   * Respuesta de no autorizado
   */
  unauthorized(message: string = "No autorizado"): NextResponse {
    const response: ApiResponse = {
      success: false,
      error: message,
      statusCode: 401,
    };

    return NextResponse.json(response, { status: 401 });
  },

  /**
   * Respuesta de prohibido
   */
  forbidden(message: string = "Acceso prohibido"): NextResponse {
    const response: ApiResponse = {
      success: false,
      error: message,
      statusCode: 403,
    };

    return NextResponse.json(response, { status: 403 });
  },

  /**
   * Respuesta de conflicto
   */
  conflict(
    message: string = "Conflicto con el recurso existente"
  ): NextResponse {
    const response: ApiResponse = {
      success: false,
      error: message,
      statusCode: 409,
    };

    return NextResponse.json(response, { status: 409 });
  },

  /**
   * Respuesta de validación fallida
   */
  validationError(
    message: string = "Datos de entrada inválidos"
  ): NextResponse {
    const response: ApiResponse = {
      success: false,
      error: message,
      statusCode: 400,
    };

    return NextResponse.json(response, { status: 400 });
  },
};

/**
 * Tipo para respuestas de API tipadas
 */
export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
  statusCode?: number;
};

export type ApiResponseType<T> = ApiSuccessResponse<T> | ApiErrorResponse;
