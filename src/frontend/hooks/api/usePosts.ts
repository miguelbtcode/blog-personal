import { postService } from "@/frontend/services/posts.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PostFilters,
  CreatePostData,
  UpdatePostData,
  PostWithDetails,
} from "@/types";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: PostFilters) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  related: (id: string) => [...postKeys.all, "related", id] as const,
  byAuthor: (authorId: string, filters?: PostFilters) =>
    [...postKeys.all, "author", authorId, filters] as const,
};

export function usePosts(filters: PostFilters = {}) {
  const query = useQuery({
    queryKey: postKeys.list(filters),
    queryFn: () => postService.getPosts(filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    ...query,
    useCreatePost: useCreatePost(),
    loading: query.isLoading,
  };
}

export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postService.getPost(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: postKeys.detail(`slug:${slug}`),
    queryFn: () => postService.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => postService.createPost(data),
    onSuccess: (newPost: PostWithDetails) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.setQueryData(postKeys.detail(newPost.id), newPost);

      if (newPost.slug) {
        queryClient.setQueryData(
          postKeys.detail(`slug:${newPost.slug}`),
          newPost
        );
      }
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdatePostData> }) =>
      postService.updatePost(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.detail(id) });

      const previousPost = queryClient.getQueryData<PostWithDetails>(
        postKeys.detail(id)
      );

      queryClient.setQueryData(
        postKeys.detail(id),
        (old: PostWithDetails | undefined) => (old ? { ...old, ...data } : old)
      );

      return { previousPost, id };
    },

    onError: (error, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(
          postKeys.detail(context.id),
          context.previousPost
        );
      }
    },

    onSettled: (updatedPost, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });

      if (updatedPost?.slug) {
        queryClient.invalidateQueries({
          queryKey: postKeys.detail(`slug:${updatedPost.slug}`),
        });
      }
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postService.deletePost(id),
    onSuccess: (success: boolean, id: string) => {
      if (success) {
        queryClient.removeQueries({ queryKey: postKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      }
    },
  });
}

export function useRelatedPosts(postId: string, limit: number = 5) {
  return useQuery({
    queryKey: postKeys.related(postId),
    queryFn: () => postService.getRelatedPosts(postId, limit),
    enabled: !!postId,
    staleTime: 1000 * 60 * 15,
  });
}

export function usePostsByAuthor(authorId: string, filters: PostFilters = {}) {
  return useQuery({
    queryKey: postKeys.byAuthor(authorId, filters),
    queryFn: () => postService.getPostsByAuthor(authorId, filters),
    enabled: !!authorId,
    staleTime: 1000 * 60 * 5,
  });
}
