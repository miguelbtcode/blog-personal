"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FeaturedImageUpload } from "@/frontend/components/admin/FeaturedImageUpload";
import { useCreatePostForm } from "@/frontend/hooks/ui/useCreatePostForm";
import { PostHeaderBar } from "@/frontend/components/admin/posts/create/PostHeaderBar";
import { PostBasicInfoForm } from "@/frontend/components/admin/posts/create/PostBasicInfoForm";
import { PostContentEditor } from "@/frontend/components/admin/posts/create/PostContentEditor";
import { PostSettingsPanel } from "@/frontend/components/admin/posts/create/PostSettingsPanel";
import { PostSidebarInfo } from "@/frontend/components/admin/posts/create/PostSidebarInfo";
import { DraftFormData, useDraftStore } from "@/frontend/stores/draft.store";
import { useToast } from "@/frontend/components/ui/Toast";
import { usePost, useUpdatePost } from "@/frontend/hooks/api/usePosts";
import { UnsavedChangesGuard } from "./posts/create/UnsavedChangesGuard";

interface PostEditorProps {
  postId: string;
  mode: "edit" | "view";
}

export function PostEditor({ postId, mode }: PostEditorProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const isReadOnly = mode === "view";

  // Hooks de datos
  const { data: postData, isLoading: postLoading } = usePost(postId);
  const updatePost = useUpdatePost();
  const { setFormData, formData: draftFormData } = useDraftStore();

  // Hook del formulario
  const {
    formData,
    errors,
    hasUnsavedChanges,
    loading,
    showUnsavedChangesModal,
    unsavedChangesConfig,
    handleConfirmLeave,
    handleCancelLeave,
    handleTitleChange,
    handleExcerptChange,
    handleContentChange,
    handleStatusChange,
    handleBack,
    handleCancel,
    canPublish,
  } = useCreatePostForm("edit");

  // Cargar datos del post
  useEffect(() => {
    if (postData && !draftFormData?.title) {
      const postFormData: DraftFormData = {
        title: postData.title,
        excerpt: postData.excerpt || "",
        featuredImage: postData.featuredImage || "",
        content: postData.content,
        status: postData.status as "DRAFT" | "PUBLISHED",
      };
      setFormData(postFormData);
    }
  }, [postData, draftFormData?.title, setFormData]);

  // Handlers para edición
  const handleSaveDraft = async () => {
    if (!postData || isReadOnly) return;

    try {
      const updateData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: JSON.stringify(formData.content),
        featuredImage: formData.featuredImage,
        status: "DRAFT" as const,
      };

      await updatePost.mutateAsync({
        id: postData.id,
        data: updateData,
      });

      success(
        "¡Borrador guardado exitosamente!",
        `"${formData.title}" se guardó correctamente`,
        2500
      );

      setTimeout(() => {
        router.push("/admin/posts");
      }, 2200);
    } catch (err) {
      error("Error al guardar", "No se pudo guardar el borrador");
    }
  };

  const handlePublish = async () => {
    if (!postData || !canPublish || isReadOnly) return;

    try {
      const updateData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: JSON.stringify(formData.content),
        featuredImage: formData.featuredImage,
        status: "PUBLISHED" as const,
      };

      await updatePost.mutateAsync({
        id: postData.id,
        data: updateData,
      });

      success(
        "¡Post publicado exitosamente!",
        `"${formData.title}" ya está disponible`,
        2500
      );

      setTimeout(() => {
        router.push("/admin/posts");
      }, 2200);
    } catch (err) {
      error("Error al publicar", "No se pudo publicar el post");
    }
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando post...</p>
        </div>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Post no encontrado</p>
          <button
            onClick={() => router.push("/admin/posts")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Volver a Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modal de confirmación (solo en modo edit) */}
      {!isReadOnly && (
        <UnsavedChangesGuard
          isOpen={showUnsavedChangesModal}
          onConfirm={handleConfirmLeave}
          onCancel={handleCancelLeave}
          {...unsavedChangesConfig}
        />
      )}

      {/* Header */}
      <PostHeaderBar
        title={
          isReadOnly
            ? `Viendo: ${postData.title}`
            : formData.title || `Editando: ${postData.title}`
        }
        hasUnsavedChanges={!isReadOnly && hasUnsavedChanges}
        loading={loading || updatePost.isPending}
        canPublish={!isReadOnly && canPublish}
        onBack={handleBack}
        onCancel={handleCancel}
        onSaveDraft={isReadOnly ? undefined : handleSaveDraft}
        onPublish={isReadOnly ? undefined : handlePublish}
        isReadOnly={isReadOnly}
      />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Contenido Principal */}
          <div className="xl:col-span-3 space-y-8">
            <PostBasicInfoForm
              title={formData.title}
              excerpt={formData.excerpt}
              errors={errors}
              onTitleChange={isReadOnly ? undefined : handleTitleChange}
              onExcerptChange={isReadOnly ? undefined : handleExcerptChange}
              readOnly={isReadOnly}
            />

            <PostContentEditor
              content={formData.content}
              onChange={isReadOnly ? undefined : handleContentChange}
              readOnly={isReadOnly}
            />
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <PostSettingsPanel
              status={formData.status}
              onStatusChange={isReadOnly ? undefined : handleStatusChange}
              readOnly={isReadOnly}
            />

            {!isReadOnly && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-6">
                  Imagen Destacada
                </h3>
                <FeaturedImageUpload />
              </div>
            )}

            <PostSidebarInfo
              hasUnsavedChanges={!isReadOnly && hasUnsavedChanges}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
