"use client";

import { useCallback } from "react";
import {
  Upload,
  X,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useDraftStore } from "@/frontend/stores/draft.store";
import { useUploadStore } from "@/frontend/stores/upload.store";

export function FeaturedImageUpload() {
  // Draft store para los datos
  const { formData, setFeaturedImage, clearFeaturedImage } = useDraftStore();

  // Upload store para el estado de upload
  const { uploadState, uploadImage, clearError, resetState } = useUploadStore();

  const featuredImage = formData?.featuredImage || "";

  const handleFileUpload = useCallback(
    async (file: File) => {
      const result = await uploadImage(file);
      if (result) {
        setFeaturedImage(result.url);
      }
    },
    [uploadImage, setFeaturedImage]
  );

  const handleRemoveImage = useCallback(() => {
    clearFeaturedImage();
    resetState();
  }, [clearFeaturedImage, resetState]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (uploadState.uploading) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]!);
      }
    },
    [handleFileUpload, uploadState.uploading]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFeaturedImage(e.target.value);
      if (uploadState.error) {
        clearError();
      }
    },
    [setFeaturedImage, uploadState.error, clearError]
  );

  return (
    <div className="space-y-4">
      {featuredImage ? (
        <div className="space-y-4">
          {/* Imagen actual */}
          <div className="relative group">
            <img
              src={featuredImage}
              alt="Imagen destacada"
              className="w-full h-48 object-cover rounded-lg border border-border"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.jpg";
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <button
                onClick={handleRemoveImage}
                disabled={uploadState.uploading}
                className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm font-medium hover:bg-destructive/80 disabled:opacity-50 flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Remover</span>
              </button>
            </div>
          </div>

          {/* Información de la imagen */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <ImageIcon className="w-4 h-4" />
              <span>Imagen cargada correctamente</span>
            </div>
          </div>

          {/* Opción para cambiar URL */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Cambiar URL manualmente
            </summary>
            <div className="mt-2">
              <input
                type="url"
                value={featuredImage}
                onChange={handleUrlChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                disabled={uploadState.uploading}
                className="w-full p-3 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
              />
            </div>
          </details>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            uploadState.uploading
              ? "border-muted bg-muted/20 cursor-not-allowed"
              : "border-border hover:border-primary/50 cursor-pointer"
          }`}
        >
          <div className="space-y-4">
            {uploadState.uploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-medium text-foreground">
                  Subiendo imagen...
                </p>
                {uploadState.progress !== undefined &&
                  uploadState.progress > 0 && (
                    <div className="w-full max-w-xs bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadState.progress}%` }}
                      />
                    </div>
                  )}
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Arrastra una imagen aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Recomendado: 1200x630px, máximo 5MB (JPG, PNG, WebP)
                  </p>
                </div>
              </>
            )}
          </div>

          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            disabled={uploadState.uploading}
            className="hidden"
            id="featured-image-upload"
          />

          {!uploadState.uploading && (
            <label
              htmlFor="featured-image-upload"
              className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/80 transition-colors cursor-pointer"
            >
              Seleccionar imagen
            </label>
          )}

          {/* URL Input alternativo */}
          <div className="mt-4 pt-4 border-t border-border">
            <input
              type="url"
              placeholder="O pega una URL de imagen..."
              onChange={handleUrlChange}
              disabled={uploadState.uploading}
              className="w-full p-3 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadState.error && (
        <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{uploadState.error}</span>
          <button
            onClick={clearError}
            className="ml-auto text-xs hover:underline"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
