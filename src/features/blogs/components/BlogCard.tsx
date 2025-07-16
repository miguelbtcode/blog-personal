import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  post: {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    readTime: number;
    publishedAt: string;
    slug: string;
  };
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <Link href={`/blog/${post.slug}`}>
        <div className="relative aspect-video">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Category & Read Time */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="bg-gray-100 px-2 py-1 rounded">{post.category}</span>
          <span>{post.readTime} min read</span>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        {/* Read More Button */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center justify-center w-8 h-8 bg-primary/90 text-white rounded-full hover:bg-primary transition-colors"
        >
          <svg
            className="w-4 h-4"
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
    </article>
  );
}
