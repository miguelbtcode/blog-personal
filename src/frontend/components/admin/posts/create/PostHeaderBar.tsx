"use client";

import { Save, ArrowLeft, Eye } from "lucide-react";

interface PostHeaderBarProps {
  title: string;
  hasUnsavedChanges: boolean;
  loading: boolean;
  canPublish: boolean;
  onBack: () => void;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function PostHeaderBar({
  title,
  hasUnsavedChanges,
  loading,
  canPublish,
  onBack,
  onCancel,
  onSaveDraft,
  onPublish,
}: PostHeaderBarProps) {
  return (
    <div className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Crear Nuevo Post
              </h1>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  {title || "Sin título"}
                </p>
                {hasUnsavedChanges && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    Sin guardar
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={onSaveDraft}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-accent text-foreground rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Guardando..." : "Guardar Borrador"}</span>
            </button>

            <button
              onClick={onPublish}
              disabled={loading || !canPublish}
              className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              <span>Publicar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
