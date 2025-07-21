"use client";

import { PostEditor } from "@/frontend/components/admin/posts/PostEditor";
import { use } from "react";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = use(params);
  return <PostEditor postId={id} mode="edit" />;
}
