import { uploadImageClientSchema } from "@/shared/schemas/upload.schemas";

export const useFileValidation = () => {
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const validation = uploadImageClientSchema.safeParse({ file });

    if (!validation.success) {
      return {
        isValid: false,
        error: validation.error.issues[0]?.message,
      };
    }

    return { isValid: true };
  };

  return { validateFile };
};
