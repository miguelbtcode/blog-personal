import z from "zod";

export class ValidationError extends Error {
  constructor(public issues: z.ZodIssue[]) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}
