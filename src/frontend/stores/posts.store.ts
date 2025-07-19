import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { postService } from "@/frontend/services/posts.service";
import type { PaginationMeta } from "@/types/api.types";
import {
  Post,
  PostFilters,
  CreatePostData,
  UpdatePostData,
  PostWithDetails,
} from "@/types";

interface PostsStore {
  // State
  posts: PostWithDetails[];
  currentPost: PostWithDetails | null; // ← Agregado para post actual
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  currentFilters: PostFilters;

  // Actions
  setPosts: (posts: PostWithDetails[]) => void;
  setCurrentPost: (post: PostWithDetails | null) => void; // ← Agregado
  setPagination: (pagination: PaginationMeta | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: PostFilters) => void;

  // Async actions
  fetchPosts: (filters?: PostFilters) => Promise<void>;
  getPost: (id: string) => Promise<PostWithDetails | null>; // ← Agregado
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
      currentPost: null, // ← Agregado
      pagination: null,
      loading: false,
      error: null,
      currentFilters: {},

      // Setters
      setPosts: (posts) => set({ posts }),
      setCurrentPost: (post) => set({ currentPost: post }), // ← Agregado
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

          console.log("Fetching posts with filters:", mergedFilters);

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

      // ← MÉTODO AGREGADO
      getPost: async (id: string) => {
        try {
          set({ loading: true, error: null });

          console.log("Fetching post with id:", id);

          const response = await postService.getPost(id);

          if (!response.success || !response.data) {
            throw new Error(response.error || "Post no encontrado");
          }

          console.log("Fetched post:", response.data);

          set({ currentPost: response.data });
          return response.data;
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error al cargar post";
          set({ error: errorMessage });
          return null;
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

          console.warn("Created post:", response.data);

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
            // También actualizar currentPost si es el mismo
            currentPost:
              state.currentPost?.id === id
                ? { ...state.currentPost, ...response.data }
                : state.currentPost,
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
            currentPost:
              state.currentPost?.id === id ? null : state.currentPost, // ← Limpiar si es el actual
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
