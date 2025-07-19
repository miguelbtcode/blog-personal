"use client";

import { PostBuilder } from "@/frontend/components/admin/PostBuilder";
import type { PostContent } from "@/types/content";

interface PostContentEditorProps {
  content: PostContent;
  onChange: (content: PostContent) => void;
}

export function PostContentEditor({
  content,
  onChange,
}: PostContentEditorProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Contenido del Post
      </h2>
      <PostBuilder initialContent={content} onChange={onChange} />
    </div>
  );
}
