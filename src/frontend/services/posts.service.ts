import {
  CreatePostData,
  UpdatePostData,
  PostWithDetails,
  PostFilters,
  PaginationMeta,
} from "@/types";
import {
  createPostSchema,
  updatePostSchema,
  postFiltersSchema,
  CreatePostInput,
  UpdatePostInput,
} from "@/shared/schemas/post.schemas";
import { apiService } from "./api.service";
import { parsePostContent } from "@/lib/blockUtils";

interface PostsListResponse {
  items: PostWithDetails[];
  pagination: PaginationMeta;
}

export class PostService {
  async getPosts(filters: PostFilters = {}): Promise<PostsListResponse> {
    // Validar filtros con schema
    const validatedFilters = postFiltersSchema.parse(filters);

    const searchParams = new URLSearchParams();
    Object.entries(validatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const endpoint = `/posts${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const response = await apiService.request<PostsListResponse>(endpoint);
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error al obtener posts");
    }
    return response.data;
  }

  async getPost(id: string): Promise<PostWithDetails> {
    if (!id?.trim()) {
      throw new Error("ID de post inválido");
    }

    const response = await apiService.request<PostWithDetails>(`/posts/${id}`);
    if (!response.success || !response.data) {
      throw new Error(response.error || "Post no encontrado");
    }

    response.data.content = parsePostContent(response.data.content);

    return response.data;
  }

  async getPostBySlug(slug: string): Promise<PostWithDetails> {
    if (!slug?.trim()) {
      throw new Error("Slug de post inválido");
    }

    const response = await apiService.request<PostWithDetails>(
      `/posts/slug/${slug}`
    );
    if (!response.success || !response.data) {
      throw new Error(response.error || "Post no encontrado");
    }
    return response.data;
  }

  async createPost(data: CreatePostData): Promise<PostWithDetails> {
    // Validar datos con schema
    const validatedData: CreatePostInput = createPostSchema.parse(data);

    const response = await apiService.request<PostWithDetails>("/posts", {
      method: "POST",
      body: JSON.stringify(validatedData),
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || "Error al crear post");
    }
    return response.data;
  }

  async updatePost(
    id: string,
    data: Partial<UpdatePostData>
  ): Promise<PostWithDetails> {
    try {
      if (!id?.trim()) {
        throw new Error("ID de post inválido");
      }

      console.log("Updating post with data:", {
        ...data,
        id,
      });

      // Validar datos con schema (incluye el ID)
      const validatedData: UpdatePostInput = updatePostSchema.parse({
        ...data,
        id,
      });

      const response = await apiService.request<PostWithDetails>(
        `/posts/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(validatedData),
        }
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Error al actualizar post");
      }
      return response.data;
    } catch (error) {
      console.error("Error updating post:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error al actualizar post"
      );
    }
  }

  async deletePost(id: string): Promise<boolean> {
    if (!id?.trim()) {
      throw new Error("ID de post inválido");
    }

    const response = await apiService.request<null>(`/posts/${id}`, {
      method: "DELETE",
    });

    return response.success;
  }

  async getRelatedPosts(
    postId: string,
    limit: number = 5
  ): Promise<PostWithDetails[]> {
    if (!postId?.trim()) {
      throw new Error("ID de post inválido");
    }

    if (limit < 1 || limit > 20) {
      throw new Error("El límite debe estar entre 1 y 20");
    }

    const response = await apiService.request<PostWithDetails[]>(
      `/posts/${postId}/related?limit=${limit}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || "Error al obtener posts relacionados");
    }
    return response.data;
  }

  async getPostsByAuthor(
    authorId: string,
    filters: PostFilters = {}
  ): Promise<PostsListResponse> {
    if (!authorId?.trim()) {
      throw new Error("ID de autor inválido");
    }

    // Validar filtros con schema
    const validatedFilters = postFiltersSchema.parse(filters);

    const searchParams = new URLSearchParams();
    Object.entries(validatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const endpoint = `/posts/author/${authorId}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const response = await apiService.request<PostsListResponse>(endpoint);
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error al obtener posts del autor");
    }
    return response.data;
  }
}

export const postService = new PostService();
