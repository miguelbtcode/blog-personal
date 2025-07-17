export interface ContentBlock {
  id: string;
  type: "heading" | "paragraph" | "code" | "image";
  order: number;
  data: HeadingData | ParagraphData | CodeData | ImageData;
}

export interface HeadingData {
  level: 2 | 3 | 4;
  text: string;
}

export interface ParagraphData {
  text: string;
  formatting: TextFormat[];
}

export interface CodeData {
  language: string;
  code: string;
  filename?: string;
  showLineNumbers: boolean;
}

export interface ImageData {
  url: string;
  alt: string;
  caption?: string;
}

export interface TextFormat {
  start: number;
  end: number;
  type: "bold" | "italic" | "underline";
}

export interface PostContent {
  blocks: ContentBlock[];
  version: string;
}

export type BlockType = ContentBlock["type"];
export type BlockData = ContentBlock["data"];
