"use client";

import { Settings2 } from "lucide-react";

interface PostSettingsPanelProps {
  status: "DRAFT" | "PUBLISHED";
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function PostSettingsPanel({
  status,
  onStatusChange,
}: PostSettingsPanelProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <Settings2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Configuración</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Estado del post
          </label>
          <select
            value={status}
            onChange={onStatusChange}
            className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="DRAFT">📝 Borrador</option>
            <option value="PUBLISHED">🚀 Publicado</option>
          </select>
        </div>
      </div>
    </div>
  );
}
