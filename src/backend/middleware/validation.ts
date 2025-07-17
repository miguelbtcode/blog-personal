import { ValidationError } from "@/lib/errors";
import { NextRequest } from "next/server";
import z from "zod";

export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<T> => {
    try {
      const body = await request.json();
      return schema.parse(body);
    } catch (error) {
      console.error("Validation error:", error);
      if (error instanceof z.ZodError) {
        throw new ValidationError(error.issues);
      }
      throw error;
    }
  };
}
