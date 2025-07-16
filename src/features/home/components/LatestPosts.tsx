import PostCard from "./PostCard";
import Pagination from "./Pagination";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  createdAt: string;
  viewCount: number;
  author: {
    name: string;
  };
  categories?: {
    name: string;
    slug: string;
  }[];
}

interface LatestPostsProps {
  posts: Post[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    total: number;
  };
  showPagination?: boolean;
}

export default function LatestPosts({
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
          <div className="bg-gray-50 rounded-lg p-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay publicaciones aún
            </h3>
            <p className="text-gray-600">
              ¡Pronto habrá contenido interesante para leer!
            </p>
          </div>
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
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Paginación */}
        {showPagination && pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            total={pagination.total}
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
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
