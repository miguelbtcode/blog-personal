import { Plus } from "lucide-react";
import type { BlockType } from "@/types/content";

interface BlockToolbarProps {
  onAddBlock: (type: BlockType) => void;
}

export function BlockToolbar({ onAddBlock }: BlockToolbarProps) {
  const blockTypes = [
    { type: "heading" as const, label: "Título", icon: "H" },
    { type: "paragraph" as const, label: "Párrafo", icon: "P" },
    { type: "code" as const, label: "Código", icon: "</>" },
    { type: "image" as const, label: "Imagen", icon: "🖼️" },
  ];

  return (
    <div className="flex gap-4 p-6 border-2 border-dashed border-border/60 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
      <Plus className="w-5 h-5 text-primary mt-0.5" />
      <span className="text-sm font-medium text-foreground mr-2">
        Agregar bloque:
      </span>

      <div className="flex gap-3">
        {blockTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => onAddBlock(type)}
            className="px-4 py-2 text-sm border border-border bg-card text-foreground rounded-lg hover:bg-accent hover:border-primary/50 transition-all duration-200 flex items-center gap-2 font-medium shadow-sm"
          >
            <span className="text-sm">{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
