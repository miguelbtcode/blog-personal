import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createEmptyPost } from "@/lib/blockUtils";
import { useToast } from "@/frontend/components/ui/Toast";
import { useCreatePost, usePosts } from "@/frontend/hooks/api/usePosts";
import { useDraftStore } from "@/frontend/stores/draft.store";
import { useKeyboardShortcuts } from "@/frontend/hooks/ui/useKeyboardShortcuts";
import { useNavigationGuard } from "@/frontend/hooks/auth/useNavigationGuard";
import type { PostContent } from "@/types/content";
import type { CreatePostData } from "@/types";

interface UseCreatePostFormReturn {
  // Estado del formulario
  formData: {
    title: string;
    excerpt: string;
    featuredImage: string;
    content: PostContent;
    status: "DRAFT" | "PUBLISHED";
  };
  errors: Record<string, string>;
  hasUnsavedChanges: boolean;
  loading: boolean;

  // Estado del modal de confirmación (reemplaza al DraftRecoveryDialog)
  showUnsavedChangesModal: boolean;
  unsavedChangesConfig: {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
  };

  // Handlers del modal
  handleConfirmLeave: () => void;
  handleCancelLeave: () => void;

  // Para casos específicos donde se necesita cargar un draft
  shouldShowDraftDialog: boolean;
  handleLoadDraft: () => void;
  handleDiscardDraft: () => void;

  // Handlers del formulario
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExcerptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleContentChange: (content: PostContent) => void;
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  // Handlers de acciones
  handleBack: () => void;
  handleCancel: () => void;
  handleSaveDraft: () => void;
  handlePublish: () => void;

  // Estado computado
  canPublish: boolean;
}

export function useCreatePostForm(
  mode: "create" | "edit" = "create"
): UseCreatePostFormReturn {
  const { toast } = useToast();
  const router = useRouter();
  const createPostMutation = useCreatePost();

  // Draft management
  const {
    formData: draftData,
    hasUnsavedChanges,
    updateFormData,
    clearDraft,
    hasDraft,
  } = useDraftStore();

  // Local state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estado para modal de confirmación de cambios sin guardar
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [unsavedChangesConfig, setUnsavedChangesConfig] = useState({
    title: "¿Abandonar sin guardar?",
    message:
      "Tienes cambios sin guardar que se perderán si continúas. ¿Estás seguro de que quieres salir?",
    confirmText: "Abandonar cambios",
    cancelText: "Continuar editando",
  });

  // Estado para el diálogo de draft (solo en modo create)
  const [shouldShowDraftDialog, setShouldShowDraftDialog] = useState(false);

  // Refs para controlar acciones pendientes
  const pendingActionRef = useRef<(() => void) | null>(null);
  const dialogShownRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // Datos del formulario
  const formData = draftData || {
    title: "",
    excerpt: "",
    featuredImage: "",
    content: createEmptyPost(),
    status: "DRAFT" as const,
  };

  // === EFFECTS ===

  // Cargar borrador al montar
  useEffect(() => {
    if (
      mode === "create" &&
      !hasInitializedRef.current &&
      !dialogShownRef.current
    ) {
      hasInitializedRef.current = true;

      if (draftData && hasDraft()) {
        const hasContent =
          draftData.title ||
          draftData.excerpt ||
          draftData.featuredImage ||
          (draftData.content &&
            JSON.stringify(draftData.content) !==
              JSON.stringify(createEmptyPost()));

        if (hasContent) {
          setShouldShowDraftDialog(true);
          dialogShownRef.current = true;
        }
      }
    }
  }, [mode, draftData, hasDraft]);

  // === VALIDATION ===

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    } else if (formData.title.length > 200) {
      newErrors.title = "El título no puede exceder 200 caracteres";
    }

    if (formData.excerpt.length > 300) {
      newErrors.excerpt = "El resumen no puede exceder 300 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const clearFieldError = useCallback(
    (field: string) => {
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  // === MODAL HANDLERS ===

  const showUnsavedChangesConfirmation = useCallback(
    (action: () => void, config?: Partial<typeof unsavedChangesConfig>) => {
      pendingActionRef.current = action;
      if (config) {
        setUnsavedChangesConfig((prev) => ({ ...prev, ...config }));
      }
      setShowUnsavedChangesModal(true);
    },
    []
  );

  const handleConfirmLeave = useCallback(() => {
    setShowUnsavedChangesModal(false);
    if (pendingActionRef.current) {
      pendingActionRef.current();
      pendingActionRef.current = null;
    }
  }, []);

  const handleCancelLeave = useCallback(() => {
    setShowUnsavedChangesModal(false);
    pendingActionRef.current = null;
  }, []);

  // === DRAFT HANDLERS ===

  const handleLoadDraft = useCallback(() => {
    setShouldShowDraftDialog(false);
    toast({
      title: "Borrador cargado",
      description: "Se ha restaurado tu trabajo anterior",
      variant: "default",
    });
  }, [toast]);

  const handleDiscardDraft = useCallback(() => {
    clearDraft();
    setShouldShowDraftDialog(false);
    dialogShownRef.current = false;
    toast({
      title: "Borrador descartado",
      description: "Se ha eliminado el borrador anterior",
      variant: "default",
    });
  }, [clearDraft, toast]);

  // === FORM HANDLERS ===

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFormData({ title: e.target.value });
      clearFieldError("title");
    },
    [updateFormData, clearFieldError]
  );

  const handleExcerptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateFormData({ excerpt: e.target.value });
      clearFieldError("excerpt");
    },
    [updateFormData, clearFieldError]
  );

  const handleContentChange = useCallback(
    (content: PostContent) => {
      updateFormData({ content });
    },
    [updateFormData]
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateFormData({ status: e.target.value as "DRAFT" | "PUBLISHED" });
    },
    [updateFormData]
  );

  // === ACTION HANDLERS ===

  const handleSaveDraft = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const postData: CreatePostData = {
        title: formData.title,
        excerpt: formData.excerpt,
        featuredImage: formData.featuredImage,
        content: JSON.parse(JSON.stringify(formData.content)),
        status: "DRAFT",
      };

      const result = await createPostMutation.mutateAsync(postData);

      if (result) {
        clearDraft();
        dialogShownRef.current = false;
        toast({
          title: "Borrador guardado",
          description: `"${result.title}" se guardó como borrador`,
          variant: "default",
        });
        router.push("/admin/posts");
      }
    } catch (err) {
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar el borrador",
        variant: "destructive",
      });
    }
  }, [formData, validateForm, createPostMutation, clearDraft, toast, router]);

  const handlePublish = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const postData: CreatePostData = {
        title: formData.title,
        excerpt: formData.excerpt,
        featuredImage: formData.featuredImage,
        content: JSON.parse(JSON.stringify(formData.content)),
        status: "PUBLISHED",
      };

      const result = await createPostMutation.mutateAsync(postData);

      if (result) {
        clearDraft();
        dialogShownRef.current = false;
        toast({
          title: "Post publicado",
          description: `"${result.title}" se publicó exitosamente`,
          variant: "default",
        });
        router.push("/admin/posts");
      }
    } catch (err) {
      toast({
        title: "Error al publicar",
        description: "No se pudo publicar el post",
        variant: "destructive",
      });
    }
  }, [formData, validateForm, createPostMutation, clearDraft, toast, router]);

  // === NAVIGATION HANDLERS ===

  const handleBack = useCallback(() => {
    const doBack = () => router.back();

    if (hasUnsavedChanges) {
      showUnsavedChangesConfirmation(doBack, {
        title: "¿Salir sin guardar?",
        message:
          "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?",
        confirmText: "Salir",
        cancelText: "Quedarme",
      });
    } else {
      doBack();
    }
  }, [hasUnsavedChanges, router, showUnsavedChangesConfirmation]);

  const handleCancel = useCallback(() => {
    const doCancel = () => {
      clearDraft();
      dialogShownRef.current = false;
      router.back();
    };

    if (hasUnsavedChanges) {
      showUnsavedChangesConfirmation(doCancel, {
        title: "¿Cancelar edición?",
        message:
          "¿Estás seguro de que quieres cancelar? Se perderán todos los cambios sin guardar.",
        confirmText: "Cancelar edición",
        cancelText: "Continuar editando",
      });
    } else {
      doCancel();
    }
  }, [hasUnsavedChanges, clearDraft, router, showUnsavedChangesConfirmation]);

  // === COMPUTED VALUES ===

  const canPublish = formData.title.trim().length > 0;

  // === SETUP HOOKS ===

  // Proteger navegación
  useNavigationGuard({
    hasUnsavedChanges,
    message:
      "Tienes cambios sin guardar en tu post. ¿Estás seguro de que quieres salir?",
  });

  // Atajos de teclado
  useKeyboardShortcuts({
    onSave: handleSaveDraft,
    onPublish: handlePublish,
    onCancel: handleCancel,
    enabled: !showUnsavedChangesModal && !shouldShowDraftDialog,
  });
  // === RETURN ===

  return {
    // Estado del formulario
    formData,
    errors,
    hasUnsavedChanges,
    loading: createPostMutation.isPending,

    // Estado del modal de confirmación
    showUnsavedChangesModal,
    unsavedChangesConfig,

    // Handlers del modal
    handleConfirmLeave,
    handleCancelLeave,

    // Handlers del diálogo
    shouldShowDraftDialog,
    handleLoadDraft,
    handleDiscardDraft,

    // Handlers del formulario
    handleTitleChange,
    handleExcerptChange,
    handleContentChange,
    handleStatusChange,

    // Handlers de acciones
    handleBack,
    handleCancel,
    handleSaveDraft,
    handlePublish,

    // Estado computado
    canPublish,
  };
}
