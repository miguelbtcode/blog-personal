import { Suspense } from "react";
import { BlogGrid } from "@/frontend/components/blog/BlogGrid";
import { BlogFilters } from "@/frontend/components/blog/BlogFilters";
import { LoadingGrid } from "@/shared/components/ui/LoadingGrid";
import { PostFilters } from "@/types";

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const filters: PostFilters = {
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    category: searchParams.category,
    tag: searchParams.tag,
    search: searchParams.search,
    sortBy: searchParams.sortBy || "publishedAt",
    sortOrder: (searchParams.sortOrder || "desc") as "asc" | "desc",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title */}
      <div className="max-w-7xl mx-auto text-center px-4 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Todos los posts</h1>
        <p className="mt-2 text-gray-600">
          Descubre artículos sobre desarrollo, tecnología y más
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Filtros */}
        <BlogFilters
          selectedCategory={filters.category}
          selectedTag={filters.tag}
          searchQuery={filters.search}
        />

        {/* Grid de blogs con loading */}
        <Suspense fallback={<LoadingGrid />}>
          <BlogGrid filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
