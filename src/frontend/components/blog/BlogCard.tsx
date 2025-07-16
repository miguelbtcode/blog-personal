import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, MessageCircle, Eye } from "lucide-react";
import type { Post } from "@/shared/types/blog.types";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Featured Image */}
      <div className="relative aspect-video">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-6">
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: category.color || "#6366f1" }}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{post.tags.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-1" />
              <time dateTime={post.publishedAt || post.createdAt}>
                {formatDate(post.publishedAt || post.createdAt)}
              </time>
            </div>

            {post.readTime && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{post.readTime} min</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{post.viewCount}</span>
            </div>

            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span>{post.commentCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center mt-4 pt-4 border-t border-gray-200">
          {post.author.image && (
            <Image
              src={post.author.image}
              alt={post.author.name || "Autor"}
              width={32}
              height={32}
              className="rounded-full mr-3"
            />
          )}
          <span className="text-sm text-gray-700">
            {post.author.name || "Anónimo"}
          </span>
        </div>
      </div>
    </article>
  );
}
