"use client";

import { useState } from "react";
import type { ContentBlock, PostContent, BlockType } from "@/types/content";
import { createEmptyBlock, reorderBlocks } from "@/lib/blockUtils";
import { BlockToolbar } from "./BlockToolbar";
import { BlockEditor } from "./BlockEditor";

interface PostBuilderProps {
  initialContent?: PostContent;
  onChange?: (content: PostContent) => void;
  readOnly?: boolean;
}

export function PostBuilder({
  initialContent,
  onChange,
  readOnly = false,
}: PostBuilderProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    initialContent?.blocks || [createEmptyBlock("paragraph")]
  );

  const updateContent = (newBlocks: ContentBlock[]) => {
    if (readOnly || !onChange) return;

    const reorderedBlocks = reorderBlocks(newBlocks);
    setBlocks(reorderedBlocks);
    onChange({
      blocks: reorderedBlocks,
      version: "1.0",
    });
  };

  const addBlock = (type: BlockType) => {
    const newBlock = createEmptyBlock(type);
    newBlock.order = blocks.length;
    updateContent([...blocks, newBlock]);
  };

  const updateBlock = (id: string, data: any) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id ? { ...block, data } : block
    );
    updateContent(updatedBlocks);
  };

  const deleteBlock = (id: string) => {
    if (blocks.length === 1) return; // Mantener al menos un bloque
    const filteredBlocks = blocks.filter((block) => block.id !== id);
    updateContent(filteredBlocks);
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, movedBlock);
    updateContent(newBlocks);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <BlockEditor
            key={block.id}
            block={block}
            onUpdate={
              readOnly ? undefined : (data) => updateBlock(block.id, data)
            }
            onDelete={readOnly ? undefined : () => deleteBlock(block.id)}
            onMoveUp={
              readOnly || index === 0
                ? undefined
                : () => moveBlock(block.id, "up")
            }
            onMoveDown={
              readOnly || index === blocks.length - 1
                ? undefined
                : () => moveBlock(block.id, "down")
            }
            readOnly={readOnly}
          />
        ))}
      </div>

      {!readOnly && <BlockToolbar onAddBlock={addBlock} />}
    </div>
  );
}
