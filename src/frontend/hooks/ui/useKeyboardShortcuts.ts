// hooks/useKeyboardShortcuts.ts
import { useEffect } from "react";

interface KeyboardShortcutsOptions {
  onSave?: () => void;
  onPublish?: () => void;
  onCancel?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onSave,
  onPublish,
  onCancel,
  enabled = true,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + S: Guardar borrador
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        onSave?.();
      }

      // Ctrl + Enter: Publicar
      if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        onPublish?.();
      }

      // Esc: Cancelar
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSave, onPublish, onCancel, enabled]);
}
