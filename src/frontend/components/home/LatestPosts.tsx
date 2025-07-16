// src/frontend/components/home/LatestPosts.tsx
import Link from "next/link";
import { BlogCard } from "../blog/BlogCard";
import { Pagination } from "@/shared/components/ui/Pagination";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import type { Post } from "@/types/blog.types";
import type { PaginationMeta } from "@/types/api.types";
import { FileText, ArrowRight } from "lucide-react";

interface LatestPostsProps {
  posts: Post[];
  pagination?: PaginationMeta;
  showPagination?: boolean;
}

export function LatestPosts({
  posts,
  pagination,
  showPagination = false,
}: LatestPostsProps) {
  if (posts.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Últimas publicaciones
          </h2>
          <EmptyState
            icon={<FileText className="w-16 h-16 text-gray-400" />}
            title="No hay publicaciones aún"
            description="¡Pronto habrá contenido interesante para leer!"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Últimas publicaciones
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre los artículos más recientes sobre desarrollo, tecnología y
            experiencias personales.
          </p>
        </div>

        {/* Grid de posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Paginación */}
        {showPagination && pagination && pagination.pages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
          />
        )}

        {/* CTA para ver más */}
        {!showPagination && (
          <div className="text-center">
            <Link
              href="/blog"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors group"
            >
              Ver todos los artículos
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
