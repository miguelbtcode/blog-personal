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
import { usePostsStore } from "@/frontend/stores/posts.store";
import { DraftFormData, useDraftStore } from "@/frontend/stores/draft.store";
import { isPostContent } from "@/lib/blockUtils";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();

  // Usar React.use() para unwrap los params
  const { id } = use(params);

  // Store para obtener el post
  const { getPost, currentPost, loading: postLoading, error } = usePostsStore();

  // Store para manejar el draft
  const { setFormData } = useDraftStore();

  // Hook del formulario (reutilizando el mismo)
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

    // Handlers de acciones (modificados para edición)
    handleBack,
    handleCancel,
    handleSaveDraft,
    handlePublish,

    // Estado computado
    canPublish,
  } = useCreatePostForm();

  // Cargar post existente al montar
  useEffect(() => {
    const loadPost = async () => {
      try {
        console.log("Cargando post con ID:", id);
        const post = await getPost(id);
        if (post) {
          console.log("Post cargado exitosamente:", post);

          const postFormData: DraftFormData = {
            title: post.title,
            excerpt: post.excerpt || "",
            featuredImage: post.featuredImage || "",
            content: isPostContent(post.content)
              ? post.content
              : { blocks: [], version: "1.0" },
            status: post.status as "DRAFT" | "PUBLISHED",
          };

          setFormData(postFormData);
        }
      } catch (error) {
        console.error("Error cargando post:", error);
        router.push("/admin/posts");
      }
    };

    if (id) {
      loadPost();
    }
  }, [id, getPost, setFormData, router]);

  // Mostrar loading mientras carga el post
  if (postLoading && !currentPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando post...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si no se pudo cargar
  if (error && !currentPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            Error al cargar el post: {error}
          </p>
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
      {/* Diálogo de recuperación de borrador */}
      <DraftRecoveryDialog
        isOpen={showDraftDialog}
        onLoadDraft={handleLoadDraft}
        onDiscardDraft={handleDiscardDraft}
      />

      {/* Barra de header con acciones - Modificada para edición */}
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
