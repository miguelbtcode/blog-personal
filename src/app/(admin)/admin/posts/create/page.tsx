"use client";

import { useCreatePostForm } from "@/frontend/hooks/ui/useCreatePostForm";

// Componentes específicos
import { PostHeaderBar } from "@/frontend/components/admin/posts/create/PostHeaderBar";
import { PostBasicInfoForm } from "@/frontend/components/admin/posts/create/PostBasicInfoForm";
import { PostContentEditor } from "@/frontend/components/admin/posts/create/PostContentEditor";
import { PostSettingsPanel } from "@/frontend/components/admin/posts/create/PostSettingsPanel";
import { FeaturedImageUpload } from "@/frontend/components/admin/FeaturedImageUpload";
import { PostSidebarInfo } from "@/frontend/components/admin/posts/create/PostSidebarInfo";

export default function CreatePostPage() {
  // Toda la lógica abstraída en el hook
  const {
    // Estado del formulario
    formData,
    errors,
    hasUnsavedChanges,
    loading,

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
  } = useCreatePostForm();

  return (
    <div className="min-h-screen bg-background">
      {/* Barra de header con acciones */}
      <PostHeaderBar
        title={formData.title}
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
            {/* Configuración */}
            <PostSettingsPanel
              status={formData.status}
              onStatusChange={handleStatusChange}
            />

            {/* Imagen destacada */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6">
                Imagen Destacada
              </h3>
              <FeaturedImageUpload />
            </div>

            {/* Información adicional */}
            <PostSidebarInfo hasUnsavedChanges={hasUnsavedChanges} />
          </div>
        </div>
      </div>
    </div>
  );
}
