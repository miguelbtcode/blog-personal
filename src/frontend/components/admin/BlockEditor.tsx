"use client";

import { useState } from "react";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { ContentBlock } from "@/types/content";
import { HeadingEditor } from "./editors/HeadingEditor";
import { ParagraphEditor } from "./editors/ParagraphEditor";
import { CodeEditor } from "./editors/CodeEditor";
import { ImageEditor } from "./editors/ImageEditor";

interface BlockEditorProps {
  block: ContentBlock;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
  onDrop?: (draggedId: string, targetId: string) => void;
}

export function BlockEditor({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isSelected,
  onSelect,
  onDrop,
}: BlockEditorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 300);
    setHoverTimeout(timeout);
  };

  const renderEditor = () => {
    switch (block.type) {
      case "heading":
        return <HeadingEditor data={block.data} onChange={onUpdate} />;
      case "paragraph":
        return <ParagraphEditor data={block.data} onChange={onUpdate} />;
      case "code":
        return <CodeEditor data={block.data} onChange={onUpdate} />;
      case "image":
        return <ImageEditor data={block.data} onChange={onUpdate} />;
      default:
        return (
          <div className="text-muted-foreground">
            Tipo de bloque no soportado
          </div>
        );
    }
  };

  return (
    <div
      className={`group relative border bg-card rounded-lg p-6 transition-all duration-200 ${
        isDragOver
          ? "border-primary bg-primary/10 shadow-lg"
          : isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : isHovered
          ? "border-border/80 hover:shadow-sm"
          : "border-border"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData("text/plain");
        if (draggedId !== block.id && onDrop) {
          onDrop(draggedId, block.id);
        }
        setIsDragOver(false);
      }}
    >
      {/* Control lateral derecho - Eliminar */}
      {(isHovered || isSelected) && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-3 bg-card border border-border rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-colors shadow-sm"
            title="Eliminar bloque"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Controles laterales izquierdos - Centrados verticalmente */}
      {(isHovered || isSelected) && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 flex flex-col gap-2">
          {onMoveUp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className="p-3 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
              title="Mover arriba"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}

          {onMoveDown && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className="p-3 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
              title="Mover abajo"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Editor del bloque */}
      <div className="relative">{renderEditor()}</div>
    </div>
  );
}
