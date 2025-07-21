"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

// Componentes específicos
import { FeaturedImageUpload } from "@/frontend/components/admin/FeaturedImageUpload";
import { useCreatePostForm } from "@/frontend/hooks/ui/useCreatePostForm";
import { DraftRecoveryDialog } from "@/frontend/components/admin/posts/create/DraftRecoveryDialog";
import { PostHeaderBar } from "@/frontend/components/admin/posts/create/PostHeaderBar";
import { PostBasicInfoForm } from "@/frontend/components/admin/posts/create/PostBasicInfoForm";
import { PostContentEditor } from "@/frontend/components/admin/posts/create/PostContentEditor";
import { PostSettingsPanel } from "@/frontend/components/admin/posts/create/PostSettingsPanel";
import { PostSidebarInfo } from "@/frontend/components/admin/posts/create/PostSidebarInfo";
import { DraftFormData, useDraftStore } from "@/frontend/stores/draft.store";
import { isPostContent } from "@/lib/blockUtils";
import { useToast } from "@/frontend/components/ui/Toast";
import { usePerformanceMonitor } from "@/frontend/hooks/api/usePerformanceMonitor";
import { usePost, useUpdatePost } from "@/frontend/hooks/api/usePosts";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { renderCount, recordMetric } = usePerformanceMonitor("EditPostPage");

  // Unwrap params
  const { id } = use(params);

  // React Query hooks para obtener y actualizar post
  const {
    data: postData,
    isLoading: postLoading,
    error: postError,
    isError,
  } = usePost(id);

  const updatePost = useUpdatePost();

  // Store para manejar el draft
  const { setFormData, formData: draftFormData } = useDraftStore();

  // Hook del formulario modificado para edición
  const {
    // Estado del formulario
    formData,
    errors,
    hasUnsavedChanges,
    loading,

    // Estado del diálogo
    showDraftDialog,

    // Handlers del diálogo
    handleLoadDraft,
    handleDiscardDraft,

    // Handlers del formulario
    handleTitleChange,
    handleExcerptChange,
    handleContentChange,
    handleStatusChange,

    // Handlers de acciones modificados
    handleBack,
    handleCancel,

    // Estado computado
    canPublish,
  } = useCreatePostForm();

  // Cargar datos del post cuando esté disponible
  useEffect(() => {
    if (postData && !draftFormData?.title) {
      const startTime = performance.now();

      console.log("Cargando post en formulario:", postData);

      const postFormData: DraftFormData = {
        title: postData.title,
        excerpt: postData.excerpt || "",
        featuredImage: postData.featuredImage || "",
        content: isPostContent(postData.content)
          ? postData.content
          : { blocks: [], version: "1.0" },
        status: postData.status as "DRAFT" | "PUBLISHED",
      };

      setFormData(postFormData);

      const duration = performance.now() - startTime;
      recordMetric("form-load", duration);
    }
  }, [postData, draftFormData?.title, setFormData, recordMetric]);

  // Handlers modificados para usar React Query
  const handleSaveDraft = async () => {
    if (!postData) return;

    try {
      const updateData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        featuredImage: formData.featuredImage,
        status: "DRAFT" as const,
      };

      await updatePost.mutateAsync({
        id: postData.id,
        data: updateData,
      });

      toast({
        title: "Borrador guardado",
        description: "Los cambios se guardaron exitosamente",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el borrador",
        variant: "destructive",
      });
      console.error("Error saving draft:", error);
    }
  };

  const handlePublish = async () => {
    if (!postData || !canPublish) return;

    try {
      const updateData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        featuredImage: formData.featuredImage,
        status: "PUBLISHED" as const,
      };

      await updatePost.mutateAsync({
        id: postData.id,
        data: updateData,
      });

      toast({
        title: "Post publicado",
        description: "El post se publicó exitosamente",
        variant: "default",
      });

      router.push("/admin/posts");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo publicar el post",
        variant: "destructive",
      });
      console.error("Error publishing post:", error);
    }
  };

  // Debug info en desarrollo
  const debugInfo =
    process.env.NODE_ENV === "development"
      ? {
          renderCount,
          hasPost: !!postData,
          isLoading: postLoading,
          hasUnsavedChanges,
          cacheHit: postData && !postLoading,
        }
      : null;

  // Loading state
  if (postLoading && !postData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando post...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !postData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            Error al cargar el post:{" "}
            {postError?.message || "Post no encontrado"}
          </p>
          <button
            onClick={() => router.push("/admin/posts")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Volver a Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Debug info en desarrollo */}
      {debugInfo && (
        <div className="bg-gray-100 p-2 text-xs border-b">
          <strong>Debug:</strong> Renders: {debugInfo.renderCount} | Post:{" "}
          {debugInfo.hasPost ? "✓" : "✗"} | Loading:{" "}
          {debugInfo.isLoading ? "✓" : "✗"} | Changes:{" "}
          {debugInfo.hasUnsavedChanges ? "✓" : "✗"} | Cache:{" "}
          {debugInfo.cacheHit ? "✓" : "✗"}
        </div>
      )}

      {/* Diálogo de recuperación de borrador */}
      <DraftRecoveryDialog
        isOpen={showDraftDialog}
        onLoadDraft={handleLoadDraft}
        onDiscardDraft={handleDiscardDraft}
      />

      {/* Header con indicadores de estado mejorados */}
      <PostHeaderBar
        title={formData.title || `Editando: ${postData.title}`}
        hasUnsavedChanges={hasUnsavedChanges}
        loading={loading || updatePost.isPending}
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

            {/* Información adicional con estado de cache */}
            <PostSidebarInfo
              hasUnsavedChanges={hasUnsavedChanges}
              // Props adicionales para mostrar info de cache en desarrollo
              {...(process.env.NODE_ENV === "development" && {
                extraInfo: {
                  "Post ID": postData.id,
                  "Cache Status": postData && !postLoading ? "Cached" : "Fresh",
                  "Update Status": updatePost.isPending
                    ? "Updating..."
                    : "Ready",
                  "Last Modified": postData.updatedAt
                    ? new Date(postData.updatedAt).toLocaleTimeString()
                    : "Unknown",
                },
              })}
            />
          </div>
        </div>
      </div>

      {/* Indicador de auto-save */}
      {updatePost.isPending && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">Guardando cambios...</span>
          </div>
        </div>
      )}

      {/* Indicador de éxito temporal */}
      {updatePost.isSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-sm">✓ Cambios guardados</span>
          </div>
        </div>
      )}
    </div>
  );
}
