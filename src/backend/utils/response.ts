import { NextResponse } from "next/server";
import { ZodError } from "zod";
import type { ApiResponse } from "@/types/api.types";

export const createResponse = {
  success: <T>(data: T, message?: string, status = 200): NextResponse => {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    return NextResponse.json(response, { status });
  },

  error: (error: unknown, status?: number): NextResponse => {
    let errorMessage = "Error interno del servidor";
    let errorStatus = status || 500;
    let details: any = undefined;

    if (error instanceof ZodError) {
      errorMessage = "Datos inválidos";
      errorStatus = 400;
      details = error.issues;
    } else if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes("no encontrado")) {
        errorStatus = 404;
      }
    }

    console.error("API Error:", error);

    const response: ApiResponse = {
      success: false,
      error: errorMessage,
      details,
    };

    return NextResponse.json(response, { status: errorStatus });
  },
};
