import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { postService } from "@/frontend/services/posts.service";
import type { PaginationMeta } from "@/types/api.types";
import { Post, PostFilters, CreatePostData, UpdatePostData } from "@/types";

interface PostsStore {
  // State
  posts: Post[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  currentFilters: PostFilters;

  // Actions
  setPosts: (posts: Post[]) => void;
  setPagination: (pagination: PaginationMeta | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: PostFilters) => void;

  // Async actions
  fetchPosts: (filters?: PostFilters) => Promise<void>;
  createPost: (data: CreatePostData) => Promise<Post | null>;
  updatePost: (id: string, data: UpdatePostData) => Promise<Post | null>;
  deletePost: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const usePostsStore = create<PostsStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      posts: [],
      pagination: null,
      loading: false,
      error: null,
      currentFilters: {},

      // Setters
      setPosts: (posts) => set({ posts }),
      setPagination: (pagination) => set({ pagination }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilters: (filters) => set({ currentFilters: filters }),

      // Async actions
      fetchPosts: async (filters = {}) => {
        try {
          set({ loading: true, error: null });
          const mergedFilters = { ...get().currentFilters, ...filters };
          set({ currentFilters: mergedFilters });

          const response = await postService.getPosts(mergedFilters);

          console.warn("Fetched posts:", response);

          if (!response.success || !response.data) {
            throw new Error(response.error || "Error al cargar posts");
          }

          set({
            posts: response.data.items,
            pagination: response.data.pagination,
          });
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error desconocido";
          set({ error: errorMessage });
        } finally {
          set({ loading: false });
        }
      },

      createPost: async (data: CreatePostData) => {
        try {
          set({ error: null });
          const response = await postService.createPost(data);

          if (!response.success || !response.data) {
            throw new Error(response.error || "Error al crear post");
          }

          // Refresh posts
          await get().fetchPosts();
          return response.data;
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error al crear post";
          set({ error: errorMessage });
          return null;
        }
      },

      updatePost: async (id: string, data: UpdatePostData) => {
        try {
          set({ error: null });
          const response = await postService.updatePost(id, data);

          if (!response.success || !response.data) {
            throw new Error(response.error || "Error al actualizar post");
          }

          // Update local state
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === id ? { ...post, ...response.data } : post
            ),
          }));

          return response.data;
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error al actualizar post";
          set({ error: errorMessage });
          return null;
        }
      },

      deletePost: async (id: string) => {
        try {
          set({ error: null });
          const response = await postService.deletePost(id);

          if (!response.success) {
            throw new Error(response.error || "Error al eliminar post");
          }

          // Remove from local state
          set((state) => ({
            posts: state.posts.filter((post) => post.id !== id),
            pagination: state.pagination
              ? {
                  ...state.pagination,
                  total: state.pagination.total - 1,
                  totalPages: Math.ceil(
                    (state.pagination.total - 1) / state.pagination.limit
                  ),
                }
              : null,
          }));

          return true;
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error al eliminar post";
          set({ error: errorMessage });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: "posts-store" }
  )
);
