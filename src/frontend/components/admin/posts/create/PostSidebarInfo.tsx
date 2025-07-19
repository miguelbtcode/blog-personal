"use client";

interface PostSidebarInfoProps {
  hasUnsavedChanges: boolean;
}

export function PostSidebarInfo({ hasUnsavedChanges }: PostSidebarInfoProps) {
  return (
    <>
      {/* Preview Info */}
      <div className="bg-muted/50 border border-border rounded-xl p-6">
        <h4 className="text-sm font-bold text-foreground mb-3">
          💡 Vista previa
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tu post aparecerá en el blog con el título, resumen e imagen que has
          configurado.{" "}
          {hasUnsavedChanges &&
            "Los cambios se guardan automáticamente como borrador."}
        </p>

        {hasUnsavedChanges && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
            Tienes cambios sin guardar
          </div>
        )}
      </div>

      {/* Atajos de teclado */}
      <div className="bg-muted/30 border border-border rounded-xl p-4">
        <h4 className="text-sm font-semibold text-foreground mb-2">
          ⌨️ Atajos
        </h4>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div>Ctrl + S: Guardar borrador</div>
          <div>Ctrl + Enter: Publicar</div>
          <div>Esc: Cancelar</div>
        </div>
      </div>
    </>
  );
}
