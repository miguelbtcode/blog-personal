import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PostContent } from "@/types/content";

export interface DraftFormData {
  title: string;
  excerpt: string;
  featuredImage: string;
  content: PostContent;
  status: "DRAFT" | "PUBLISHED";
}

interface DraftState {
  formData: DraftFormData | null;
  hasUnsavedChanges: boolean;

  // Actions
  updateFormData: (data: Partial<DraftFormData>) => void;
  setFormData: (data: DraftFormData) => void;
  clearDraft: () => void;
  saveDraft: () => void;
  hasDraft: () => boolean;

  // Image-specific methods (cleaner interface)
  setFeaturedImage: (url: string) => void;
  clearFeaturedImage: () => void;
}

const emptyFormData: DraftFormData = {
  title: "",
  excerpt: "",
  featuredImage: "",
  content: { blocks: [], version: "1.0" },
  status: "DRAFT",
};

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      formData: null,
      hasUnsavedChanges: false,

      updateFormData: (data: Partial<DraftFormData>) => {
        set((state) => ({
          formData: state.formData
            ? { ...state.formData, ...data }
            : { ...emptyFormData, ...data },
          hasUnsavedChanges: true,
        }));
      },

      setFormData: (data: DraftFormData) => {
        set({
          formData: data,
          hasUnsavedChanges: false,
        });
      },

      clearDraft: () => {
        set({
          formData: null,
          hasUnsavedChanges: false,
        });
      },

      saveDraft: () => {
        set((state) => ({
          hasUnsavedChanges: false,
        }));
      },

      hasDraft: () => {
        const state = get();
        return state.formData !== null;
      },

      // Image-specific methods
      setFeaturedImage: (url: string) => {
        set((state) => ({
          formData: state.formData
            ? { ...state.formData, featuredImage: url }
            : { ...emptyFormData, featuredImage: url },
          hasUnsavedChanges: true,
        }));
      },

      clearFeaturedImage: () => {
        set((state) => ({
          formData: state.formData
            ? { ...state.formData, featuredImage: "" }
            : { ...emptyFormData, featuredImage: "" },
          hasUnsavedChanges: true,
        }));
      },
    }),
    {
      name: "draft-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ formData: state.formData }), // Solo persiste formData
    }
  )
);
