import { Suspense } from "react";
import { BlogsFilters } from "./components/BlogsFilters";
import { BlogsGrid } from "./components/BlogsGrid";
import { BlogsPagination } from "./components/BlogsPagination";
import { BlogsLoading } from "./components/BlogsLoading";

interface BlogsFeatureProps {
  searchParams?: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  };
}

export default function BlogsFeature({ searchParams }: BlogsFeatureProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const category = searchParams?.category;
  const tag = searchParams?.tag;
  const search = searchParams?.search;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title */}
      <div className="max-w-7xl mx-auto text-center px-4 pt-8 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Todos los posts</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Filtros */}
        <BlogsFilters
          selectedCategory={category}
          selectedTag={tag}
          searchQuery={search}
        />

        {/* Grid de blogs con loading */}
        <Suspense fallback={<BlogsLoading />}>
          <BlogsGrid
            page={currentPage}
            category={category}
            tag={tag}
            search={search}
          />
        </Suspense>

        {/* Paginación */}
        <BlogsPagination
          currentPage={currentPage}
          category={category}
          tag={tag}
          search={search}
        />
      </div>
    </div>
  );
}
