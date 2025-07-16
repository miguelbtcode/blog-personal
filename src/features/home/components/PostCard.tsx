import Link from "next/link";
import { formatDate, calculateReadTime } from "@/lib/utils";

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

interface PostCardProps {
  post: Post;
  className?: string;
}

export default function PostCard({ post, className }: PostCardProps) {
  const readTime = post.content ? calculateReadTime(post.content) : 3;

  return (
    <article className={className}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Imagen placeholder */}
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>

        <div className="p-6">
          {/* Categoría */}
          {post.categories && post.categories.length > 0 && (
            <div className="mb-3">
              <Link
                href={`/categories/${post.categories[0].slug}`}
                className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full hover:bg-blue-200 transition-colors"
              >
                {post.categories[0].name}
              </Link>
            </div>
          )}

          {/* Título */}
          <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
            <Link
              href={`/blog/${post.slug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {post.title}
            </Link>
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Por {post.author.name}</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{readTime} min lectura</span>
              <span>{post.viewCount} vistas</span>
            </div>
          </div>

          {/* Leer más */}
          <div className="mt-4">
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group"
            >
              Leer más
              <svg
                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
        </div>
      </div>
    </article>
  );
}
