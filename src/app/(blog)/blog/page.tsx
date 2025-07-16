import { Suspense } from "react";
import { BlogGrid } from "@/frontend/components/blog/BlogGrid";
import { BlogFilters } from "@/frontend/components/blog/BlogFilters";
import { LoadingGrid } from "@/shared/components/ui/LoadingGrid";
import { postQuerySchema } from "@/backend/validators/posts.validator";

interface BlogPageProps {
  searchParams: {
    page?: number;
    category?: string;
    tag?: string;
    search?: string;
  };
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const validatedParams = postQuerySchema.parse(searchParams);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title */}
      <div className="max-w-7xl mx-auto text-center px-4 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Todos los posts</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Filtros */}
        <BlogFilters
          selectedCategory={validatedParams.category}
          selectedTag={validatedParams.tag}
          searchQuery={validatedParams.search}
        />

        {/* Grid de blogs con loading */}
        <Suspense fallback={<LoadingGrid />}>
          <BlogGrid filters={validatedParams} />
        </Suspense>
      </div>
    </div>
  );
}
