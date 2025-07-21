"use client";

import { useRef } from "react";
import { Bold, Italic, Underline } from "lucide-react";
import type { ParagraphData, TextFormat } from "@/types/content";

interface ParagraphEditorProps {
  data: ParagraphData;
  onChange?: (data: ParagraphData) => void;
  readOnly?: boolean;
}

export function ParagraphEditor({
  data,
  onChange,
  readOnly = false,
}: ParagraphEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (type: TextFormat["type"]) => {
    if (readOnly || !onChange) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) return;

    const newFormat: TextFormat = { start, end, type };
    onChange({ ...data, formatting: [...data.formatting, newFormat] });
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
      {!readOnly && (
        <div className="flex gap-1 border-b border-border pb-3">
          <button
            onClick={() => applyFormat("bold")}
            className="p-2 hover:bg-muted rounded-lg"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormat("italic")}
            className="p-2 hover:bg-muted rounded-lg"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormat("underline")}
            className="p-2 hover:bg-muted rounded-lg"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={data.text}
        onChange={
          readOnly
            ? undefined
            : (e) => onChange?.({ ...data, text: e.target.value })
        }
        placeholder="Escribe tu párrafo..."
        readOnly={readOnly}
        className={`w-full p-4 border rounded-lg resize-none ${
          readOnly
            ? "border-gray-200 bg-gray-50 cursor-default"
            : "border-border bg-background focus:ring-2 focus:ring-primary/20"
        }`}
        rows={4}
      />

      {data.formatting.length > 0 && (
        <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
          <span className="font-medium">Preview:</span>{" "}
          <span dangerouslySetInnerHTML={{ __html: renderFormattedText() }} />
        </div>
      )}
    </div>
  );
}
