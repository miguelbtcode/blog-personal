"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select } from "@/frontend/components/ui/select";
import { Search } from "lucide-react";

interface BlogFiltersProps {
  selectedCategory?: string | undefined;
  selectedTag?: string | undefined;
  searchQuery?: string | undefined;
}

// Datos temporales - después vendrán de la API
const mockCategories = [
  { id: "1", name: "Backend", slug: "backend" },
  { id: "2", name: "Cloud", slug: "cloud" },
  { id: "3", name: "Database", slug: "database" },
];

const mockTags = [
  {
    id: "1",
    name: ".NET",
    slug: "dotnet",
    color: "bg-purple-100 text-purple-800",
  },
  { id: "2", name: "Oracle", slug: "oracle", color: "bg-red-100 text-red-800" },
  {
    id: "3",
    name: "SQL Server",
    slug: "sql-server",
    color: "bg-blue-100 text-blue-800",
  },
  { id: "4", name: "React", slug: "react", color: "bg-cyan-100 text-cyan-800" },
  {
    id: "5",
    name: "Node.js",
    slug: "nodejs",
    color: "bg-green-100 text-green-800",
  },
];

export function BlogFilters({
  selectedCategory,
  selectedTag,
  searchQuery,
}: BlogFiltersProps) {
  const [search, setSearch] = useState(searchQuery || "");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilters = (filters: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: search || undefined });
  };

  const handleCategoryChange = (category: string) => {
    updateFilters({
      category: category || undefined,
      page: undefined, // Reset to page 1
    });
  };

  const handleTagChange = (tag: string) => {
    const newTag = selectedTag === tag ? undefined : tag;
    updateFilters({
      tag: newTag,
      page: undefined, // Reset to page 1
    });
  };

  const handleSortChange = (sortBy: string) => {
    const [field, order] = sortBy.split("-");
    updateFilters({
      sortBy: field || undefined,
      sortOrder: order || undefined,
      page: undefined, // Reset to page 1
    });
  };

  // Sync search state with URL
  useEffect(() => {
    setSearch(searchQuery || "");
  }, [searchQuery]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-8">
        {/* Categories */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Categoría</h3>
          <Select
            value={selectedCategory || ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {mockCategories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Sort */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Ordenar por
          </h3>
          <Select
            value={`${searchParams.get("sortBy") || "publishedAt"}-${
              searchParams.get("sortOrder") || "desc"
            }`}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="publishedAt-desc">Más recientes</option>
            <option value="publishedAt-asc">Más antiguos</option>
            <option value="viewCount-desc">Más populares</option>
            <option value="title-asc">Título (A-Z)</option>
            <option value="title-desc">Título (Z-A)</option>
          </Select>
        </div>

        {/* Tags */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Etiquetas</h3>
          <div className="flex flex-wrap gap-2">
            {mockTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagChange(tag.slug)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag.slug
                    ? "ring-2 ring-blue-500 " + tag.color
                    : tag.color + " hover:opacity-80"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filters summary */}
      {(selectedCategory || selectedTag || searchQuery) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Filtros activos:</span>
            {searchQuery && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Búsqueda: {searchQuery}
                <button
                  onClick={() => updateFilters({ search: undefined })}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {mockCategories.find((c) => c.slug === selectedCategory)?.name}
                <button
                  onClick={() => updateFilters({ category: undefined })}
                  className="ml-1 text-blue-400 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTag && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {mockTags.find((t) => t.slug === selectedTag)?.name}
                <button
                  onClick={() => updateFilters({ tag: undefined })}
                  className="ml-1 text-green-400 hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() =>
                updateFilters({
                  search: undefined,
                  category: undefined,
                  tag: undefined,
                })
              }
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Limpiar todos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
