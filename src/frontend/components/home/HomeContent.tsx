"use client";

import { usePosts } from "@/frontend/hooks/api/usePosts";
import { HeroBanner } from "./HeroBanner";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/shared/components/ui/ErrorMessage";
import { PostStatus } from "@/shared/enums";
import { LatestPosts } from "./LatestPosts";

interface HomeContentProps {
  showHero?: boolean;
  postsLimit?: number;
}

export function HomeContent({
  showHero = true,
  postsLimit = 6,
}: HomeContentProps) {
  const { posts, loading, error, refetch } = usePosts({
    limit: postsLimit,
    status: PostStatus.PUBLISHED,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <>
      {showHero && <HeroBanner />}
      <LatestPosts posts={posts} />
    </>
  );
}
