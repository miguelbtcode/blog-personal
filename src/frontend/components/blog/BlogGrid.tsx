"use client";

import { usePosts } from "@/frontend/hooks/api/usePosts";
import { BlogCard } from "./BlogCard";
import { LoadingGrid } from "@/shared/components/ui/LoadingGrid";
import { ErrorMessage } from "@/shared/components/ui/ErrorMessage";
import { Pagination } from "@/shared/components/ui/Pagination";
import type { PostQueryParams } from "@/types/blog.types";
import { FileText } from "lucide-react";
import { EmptyState } from "@/shared/components/ui/EmptyState";

interface BlogGridProps {
  filters: PostQueryParams;
}

export function BlogGrid({ filters }: BlogGridProps) {
  const { posts, pagination, loading, error, refetch } = usePosts(filters);

  if (loading) return <LoadingGrid />;

  if (error)
    return <ErrorMessage message={error} onRetry={refetch} variant="card" />;

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-12 h-12 text-gray-400" />}
        title="No se encontraron posts"
        description="Intenta cambiar los filtros o buscar algo diferente"
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
        />
      )}
    </div>
  );
}
