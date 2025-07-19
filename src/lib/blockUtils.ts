import { nanoid } from "nanoid";
import type { ContentBlock, BlockType, PostContent } from "@/types/content";
import { JsonValue } from "@prisma/client/runtime/library";

export function createEmptyBlock(type: BlockType): ContentBlock {
  const id = nanoid();

  switch (type) {
    case "heading":
      return {
        id,
        type,
        order: 0,
        data: { level: 2, text: "" },
      };
    case "paragraph":
      return {
        id,
        type,
        order: 0,
        data: { text: "", formatting: [] },
      };
    case "code":
      return {
        id,
        type,
        order: 0,
        data: {
          language: "javascript",
          code: "",
          filename: "",
          showLineNumbers: true,
        },
      };
    case "image":
      return {
        id,
        type,
        order: 0,
        data: { url: "", alt: "", caption: "" },
      };
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
}

export function createEmptyPost(): PostContent {
  return {
    blocks: [createEmptyBlock("paragraph")],
    version: "1.0",
  };
}

export function reorderBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.map((block, index) => ({
    ...block,
    order: index,
  }));
}

export function validatePostContent(content: any): content is PostContent {
  return (
    content &&
    typeof content === "object" &&
    Array.isArray(content.blocks) &&
    typeof content.version === "string"
  );
}

export function isPostContent(
  value: JsonValue
): value is PostContent & JsonValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "blocks" in value &&
    "version" in value &&
    Array.isArray((value as any).blocks)
  );
}
