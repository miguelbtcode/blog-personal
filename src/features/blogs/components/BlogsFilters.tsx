"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Select } from "@/components/ui/Select";

interface BlogsFiltersProps {
  selectedCategory?: string | undefined;
  selectedTag?: string | undefined;
  searchQuery?: string | undefined;
}

export function BlogsFilters({
  selectedCategory,
  selectedTag,
  searchQuery,
}: BlogsFiltersProps) {
  const [search, setSearch] = useState(searchQuery || "");
  const router = useRouter();
  const pathname = usePathname();

  const categories = ["Backend", "Cloud", "Database"];
  const tags = [
    { name: ".Net", color: "bg-purple-100 text-purple-800" },
    { name: "Oracle", color: "bg-red-100 text-red-800" },
    { name: "Sql Server", color: "bg-blue-100 text-blue-800" },
    { name: "React", color: "bg-cyan-100 text-cyan-800" },
    { name: "Node.js", color: "bg-green-100 text-green-800" },
  ];

  const updateFilters = (filters: Record<string, string | undefined>) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      search: search || undefined,
      category: selectedCategory,
      tag: selectedTag,
    });
  };

  const handleCategoryChange = (category: string) => {
    updateFilters({
      category: category,
      tag: selectedTag,
      search: searchQuery,
    });
  };

  const handleTagChange = (tag: string) => {
    const newTag = selectedTag === tag ? undefined : tag;
    updateFilters({
      category: selectedCategory,
      tag: newTag,
      search: searchQuery,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Blogs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-8">
        {/* Categories */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
          <Select
            value={selectedCategory || ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>

        {/* Sort */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Order</h3>
          <Select>
            <option>Newest</option>
            <option>Oldest</option>
            <option>Most Popular</option>
          </Select>
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => handleTagChange(tag.name)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag.name
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
    </div>
  );
}
