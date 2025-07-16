import { BlogCard } from "./BlogCard";

interface BlogsGridProps {
  page: number;
  category?: string | undefined;
  tag?: string | undefined;
  search?: string | undefined;
}

// Mock data - replace with actual API call
const mockPosts = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: "Image cover from the post",
  excerpt:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  image: "/api/placeholder/300/200",
  category: ["Backend", "Cloud", "Database"][i % 3],
  readTime: 5,
  publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
  slug: `post-${i + 1}`,
}));

export async function BlogsGrid({
  page,
  category,
  tag,
  search,
}: BlogsGridProps) {
  // In real implementation, fetch data here based on filters
  // const posts = await getPosts({ page, category, tag, search });

  const posts = mockPosts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
