"use client";

import { AlertTriangle } from "lucide-react";

interface DraftRecoveryDialogProps {
  isOpen: boolean;
  onLoadDraft: () => void;
  onDiscardDraft: () => void;
}

export function DraftRecoveryDialog({
  isOpen,
  onLoadDraft,
  onDiscardDraft,
}: DraftRecoveryDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold">Borrador encontrado</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Tienes un borrador sin publicar. ¿Quieres continuar donde lo dejaste?
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onLoadDraft}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Cargar borrador
          </button>
          <button
            onClick={onDiscardDraft}
            className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80"
          >
            Empezar nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
