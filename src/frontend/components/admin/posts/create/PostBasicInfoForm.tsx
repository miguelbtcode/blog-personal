"use client";

import { AlertCircle, FileText } from "lucide-react";

interface PostBasicInfoFormProps {
  title: string;
  excerpt: string;
  errors: Record<string, string>;
  onTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExcerptChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

export function PostBasicInfoForm({
  title,
  excerpt,
  errors,
  onTitleChange,
  onExcerptChange,
  readOnly = false,
}: PostBasicInfoFormProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">
          Información del Post
        </h2>
      </div>

      <div className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Título del post *
          </label>
          <input
            type="text"
            placeholder="Escribe un título atractivo..."
            value={title}
            onChange={readOnly ? undefined : onTitleChange}
            readOnly={readOnly}
            className={`w-full p-4 border rounded-xl text-2xl font-bold bg-background text-foreground placeholder:text-muted-foreground transition-all ${
              readOnly
                ? "cursor-not-allowed opacity-70"
                : errors.title
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
        </div>

        {/* Resumen */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Resumen del post
          </label>
          <textarea
            placeholder="Escribe un resumen que enganche al lector..."
            value={excerpt}
            onChange={readOnly ? undefined : onExcerptChange}
            readOnly={readOnly}
            className={`w-full p-4 border rounded-xl bg-background text-foreground placeholder:text-muted-foreground transition-all resize-none ${
              readOnly
                ? "cursor-not-allowed opacity-70"
                : errors.excerpt
                ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                : "border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
            }`}
            rows={4}
            maxLength={300}
          />
          {errors.excerpt && (
            <p className="mt-2 text-sm text-destructive flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.excerpt}</span>
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {excerpt.length}/300 caracteres
          </p>
        </div>
      </div>
    </div>
  );
}
