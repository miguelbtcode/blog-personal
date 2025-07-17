"use client";

import { useRef } from "react";
import { Bold, Italic, Underline } from "lucide-react";
import type { ParagraphData, TextFormat } from "@/types/content";

interface ParagraphEditorProps {
  data: ParagraphData;
  onChange: (data: ParagraphData) => void;
}

export function ParagraphEditor({ data, onChange }: ParagraphEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (type: TextFormat["type"]) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) return; // No hay selección

    const newFormat: TextFormat = { start, end, type };

    onChange({
      ...data,
      formatting: [...data.formatting, newFormat],
    });
  };

  const renderFormattedText = () => {
    if (!data.formatting.length) return data.text;

    let result = data.text;
    const sortedFormats = [...data.formatting].sort(
      (a, b) => b.start - a.start
    );

    sortedFormats.forEach((format) => {
      const before = result.slice(0, format.start);
      const middle = result.slice(format.start, format.end);
      const after = result.slice(format.end);

      const tag =
        format.type === "bold"
          ? "strong"
          : format.type === "italic"
          ? "em"
          : "u";
      result = `${before}<${tag}>${middle}</${tag}>${after}`;
    });

    return result;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b border-border pb-3">
        <button
          onClick={() => applyFormat("bold")}
          className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          title="Negrita"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormat("italic")}
          className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          title="Cursiva"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormat("underline")}
          className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          title="Subrayado"
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={data.text}
        onChange={(e) => onChange({ ...data, text: e.target.value })}
        placeholder="Escribe tu párrafo..."
        className="w-full p-4 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        rows={4}
      />

      {data.formatting.length > 0 && (
        <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg border border-border/50">
          <span className="font-medium">Preview:</span>{" "}
          <span
            className="text-foreground"
            dangerouslySetInnerHTML={{ __html: renderFormattedText() }}
          />
        </div>
      )}
    </div>
  );
}
