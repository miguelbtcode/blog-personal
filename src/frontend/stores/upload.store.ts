import { create } from "zustand";
import { uploadImageClientSchema } from "@/shared/schemas/upload.schemas";

interface UploadState {
  uploading: boolean;
  error: string | null;
  progress?: number;
}

interface UploadResult {
  url: string;
  publicId: string;
}

interface UploadStore {
  uploadState: UploadState;

  // Actions
  uploadImage: (file: File) => Promise<UploadResult | null>;
  clearError: () => void;
  resetState: () => void;
}

export const useUploadStore = create<UploadStore>((set, get) => ({
  uploadState: {
    uploading: false,
    error: null,
    progress: 0,
  },

  uploadImage: async (file: File): Promise<UploadResult | null> => {
    // Validación
    const validation = uploadImageClientSchema.safeParse({ file });
    if (!validation.success) {
      set({
        uploadState: {
          uploading: false,
          error: validation.error.issues[0]?.message ?? "Archivo no válido",
          progress: 0,
        },
      });
      return null;
    }

    // Inicio de upload
    set({
      uploadState: { uploading: true, error: null, progress: 0 },
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al subir imagen");
      }

      const result = await response.json();

      // Éxito
      set({
        uploadState: { uploading: false, error: null, progress: 100 },
      });

      return {
        url: result.data.url,
        publicId: result.data.publicId,
      };
    } catch (error) {
      set({
        uploadState: {
          uploading: false,
          error: error instanceof Error ? error.message : "Error desconocido",
          progress: 0,
        },
      });
      return null;
    }
  },

  clearError: () => {
    set((state) => ({
      uploadState: { ...state.uploadState, error: null },
    }));
  },

  resetState: () => {
    set({
      uploadState: { uploading: false, error: null, progress: 0 },
    });
  },
}));
