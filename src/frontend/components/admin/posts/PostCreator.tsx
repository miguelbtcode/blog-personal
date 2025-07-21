"use client";

import { useCreatePostForm } from "@/frontend/hooks/ui/useCreatePostForm";
import { PostHeaderBar } from "@/frontend/components/admin/posts/create/PostHeaderBar";
import { PostBasicInfoForm } from "@/frontend/components/admin/posts/create/PostBasicInfoForm";
import { PostContentEditor } from "@/frontend/components/admin/posts/create/PostContentEditor";
import { PostSettingsPanel } from "@/frontend/components/admin/posts/create/PostSettingsPanel";
import { PostSidebarInfo } from "@/frontend/components/admin/posts/create/PostSidebarInfo";
import { FeaturedImageUpload } from "@/frontend/components/admin/FeaturedImageUpload";
import { useDraftStore } from "@/frontend/stores/draft.store";
import { UnsavedChangesGuard } from "./create/UnsavedChangesGuard";

export function PostCreator() {
  // Hook para draft store
  const { setFormData, formData: draftData } = useDraftStore();

  // Hook específico para crear posts (modo "create")
  const {
    // Estado del formulario
    formData,
    errors,
    hasUnsavedChanges,
    loading,

    // Estado del modal de confirmación
    showUnsavedChangesModal,
    unsavedChangesConfig,

    // Handlers del modal
    handleConfirmLeave,
    handleCancelLeave,

    // Estado del diálogo de draft
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
  } = useCreatePostForm("create"); // Aseguramos que esté en modo "create"

  return (
    <div className="min-h-screen bg-background">
      {/* Guard para cambios no guardados */}
      <UnsavedChangesGuard
        isOpen={showUnsavedChangesModal}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
        title={unsavedChangesConfig?.title}
        message={unsavedChangesConfig?.message}
        confirmText={unsavedChangesConfig?.confirmText}
        cancelText={unsavedChangesConfig?.cancelText}
      />

      {/* Diálogo para cargar borrador (solo en modo create) */}
      {shouldShowDraftDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Borrador encontrado</h3>
            <p className="text-gray-600 mb-6">
              Se encontró un borrador previo. ¿Quieres continuar editándolo o
              empezar de nuevo?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLoadDraft}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Cargar borrador
              </button>
              <button
                onClick={handleDiscardDraft}
                className="flex-1 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Empezar de nuevo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra de header con acciones */}
      <PostHeaderBar
        title={formData.title || "Nuevo Post"}
        hasUnsavedChanges={hasUnsavedChanges}
        loading={loading}
        canPublish={canPublish}
        onBack={handleBack}
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Contenido Principal */}
          <div className="xl:col-span-3 space-y-8">
            {/* Información básica */}
            <PostBasicInfoForm
              title={formData.title}
              excerpt={formData.excerpt}
              errors={errors}
              onTitleChange={handleTitleChange}
              onExcerptChange={handleExcerptChange}
            />

            {/* Editor de contenido */}
            <PostContentEditor
              content={formData.content}
              onChange={handleContentChange}
            />
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Información del post */}
            <PostSidebarInfo hasUnsavedChanges={hasUnsavedChanges} />

            {/* Imagen destacada */}
            <FeaturedImageUpload />

            {/* Panel de configuración */}
            <PostSettingsPanel
              status={formData.status}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
