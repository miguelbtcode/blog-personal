"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  Eye,
  Upload,
  AlertCircle,
  FileText,
  Settings2,
} from "lucide-react";
import { PostBuilder } from "@/frontend/components/admin/PostBuilder";
import { createEmptyPost } from "@/lib/blockUtils";
import type { PostContent } from "@/types/content";
import { useToast } from "@/frontend/components/ui/Toast";
import { usePosts } from "@/frontend/hooks/api/usePosts";
import { CreatePostData } from "@/types";

interface FormData {
  title: string;
  excerpt: string;
  featuredImage: string;
  content: PostContent;
  status: "DRAFT" | "PUBLISHED";
}

export default function CreatePostPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { createPost, loading } = usePosts();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    excerpt: "",
    featuredImage: "",
    content: createEmptyPost(),
    status: "DRAFT",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Título
    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    } else if (formData.title.length > 100) {
      newErrors.title = "El título no puede exceder 100 caracteres";
    }

    // Resumen
    if (formData.excerpt.length > 300) {
      newErrors.excerpt = "El resumen no puede exceder 300 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleSave = async (asDraft = true) => {
    if (!validateForm()) return;

    try {
      const postData: CreatePostData = {
        title: formData.title,
        excerpt: formData.excerpt,
        featuredImage: formData.featuredImage,
        content: JSON.parse(JSON.stringify(formData.content)),
        status: asDraft ? ("DRAFT" as const) : ("PUBLISHED" as const),
      };

      const result = await createPost(postData);

      if (result) {
        toast({
          title: asDraft ? "Borrador guardado" : "Post publicado",
          description: `"${result.title}" ${
            asDraft ? "guardado como borrador" : "publicado exitosamente"
          }`,
          variant: "default",
        });
        // router.push(`/admin/posts/${result.slug}/edit`);
      } else {
        toast({
          title: "Error al guardar",
          description: "No se pudo guardar el post",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al procesar la solicitud",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Barra de acciones fija */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Volver"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Crear Nuevo Post
                </h1>
                <p className="text-sm text-muted-foreground">
                  {formData.title || "Sin título"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSave(true)}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-accent text-foreground rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Guardando..." : "Guardar Borrador"}</span>
              </button>

              <button
                onClick={() => handleSave(false)}
                disabled={loading || !formData.title.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                <span>Publicar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Error General */}
        {errors.general && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <span className="text-destructive">{errors.general}</span>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Contenido Principal */}
          <div className="xl:col-span-3 space-y-8">
            {/* Título Principal */}
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  Información del Post
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Título del post *
                  </label>
                  <input
                    type="text"
                    placeholder="Escribe un título atractivo..."
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    className={`w-full p-4 border rounded-xl text-2xl font-bold bg-background text-foreground placeholder:text-muted-foreground transition-all ${
                      errors.title
                        ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                        : "border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-destructive flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.title}</span>
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formData.title.length}/100 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Resumen del post
                  </label>
                  <textarea
                    placeholder="Breve descripción que aparecerá en las previews..."
                    value={formData.excerpt}
                    onChange={(e) => updateFormData("excerpt", e.target.value)}
                    className={`w-full p-4 border rounded-xl bg-background text-foreground placeholder:text-muted-foreground resize-none transition-all ${
                      errors.excerpt
                        ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                        : "border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    }`}
                    rows={4}
                  />
                  {errors.excerpt && (
                    <p className="mt-2 text-sm text-destructive flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.excerpt}</span>
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formData.excerpt.length}/300 caracteres
                  </p>
                </div>
              </div>
            </div>

            {/* Builder de Contenido */}
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Contenido del Post
              </h2>
              <PostBuilder
                initialContent={formData.content}
                onChange={(content) => updateFormData("content", content)}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Configuración */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <Settings2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">
                  Configuración
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Estado del post
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      updateFormData(
                        "status",
                        e.target.value as "DRAFT" | "PUBLISHED"
                      )
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="DRAFT">📝 Borrador</option>
                    <option value="PUBLISHED">🚀 Publicado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Imagen Destacada */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6">
                Imagen Destacada
              </h3>

              {formData.featuredImage ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <img
                      src={formData.featuredImage}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg border border-border"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => updateFormData("featuredImage", "")}
                        className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm font-medium"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium text-foreground mb-2">
                    Subir imagen destacada
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Recomendado: 1200x630px
                  </p>
                  <input
                    type="url"
                    placeholder="O pega una URL de imagen..."
                    value={formData.featuredImage}
                    onChange={(e) =>
                      updateFormData("featuredImage", e.target.value)
                    }
                    className="w-full p-3 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              )}
            </div>

            {/* Preview Info */}
            <div className="bg-muted/50 border border-border rounded-xl p-6">
              <h4 className="text-sm font-bold text-foreground mb-3">
                💡 Vista previa
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tu post aparecerá en el blog con el título, resumen e imagen que
                has configurado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
