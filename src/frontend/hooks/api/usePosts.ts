import { useEffect } from "react";
import { usePostsStore } from "@/frontend/stores/posts.store";
import { PostFilters } from "@/types";

interface UsePostsOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}

export function usePosts(
  filters: PostFilters = {},
  options: UsePostsOptions = {}
) {
  const { enabled = true, refetchOnWindowFocus = false } = options;

  const {
    posts,
    pagination,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    clearError,
  } = usePostsStore();

  // Auto-fetch on mount or filter changes
  useEffect(() => {
    if (enabled) {
      fetchPosts(filters);
    }
  }, [enabled, JSON.stringify(filters)]);

  // Window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus || !enabled) return;

    const handleFocus = () => fetchPosts();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refetchOnWindowFocus, enabled, fetchPosts]);

  // Computed values
  const hasMore = pagination?.hasNext ?? false;
  const isEmpty = posts.length === 0 && !loading && !error;
  const isFirstPage = pagination?.page === 1;
  const isLastPage = pagination
    ? pagination.page === pagination.totalPages
    : false;

  return {
    // Data
    posts,
    pagination,

    // State
    loading,
    error,

    // Actions
    refetch: () => fetchPosts(filters),
    createPost,
    updatePost,
    deletePost,
    clearError,

    // Utils
    hasMore,
    isEmpty,
    isFirstPage,
    isLastPage,
  };
}
