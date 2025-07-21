"use client";

import { PostEditor } from "@/frontend/components/admin/PostEditor";
import { use } from "react";

interface ViewPostPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewPostPage({ params }: ViewPostPageProps) {
  const { id } = use(params);
  return <PostEditor postId={id} mode="view" />;
}
