import {
  ApiResponse,
  CreatePostData,
  PaginatedResponse,
  PaginationMeta,
  PostWithDetails,
  UpdatePostData,
} from "@/types";
import { apiService } from "./api.service";

export class PostService {
  /**
   * Obtiene lista paginada de posts con filtros
   */
  async getPosts(filters: any = {}): Promise<
    ApiResponse<{
      items: PostWithDetails[];
      pagination: PaginationMeta;
    }>
  > {
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, value!.toString());
      }
    });

    const endpoint = `/posts${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    return await apiService.request(endpoint);
  }

  /**
   * Obtiene un post por slug con detalles completos
   */
  async getPostBySlug(slug: string): Promise<{
    success: boolean;
    data: PostWithDetails;
  }> {
    return apiService.request(`/posts/slug/${slug}`);
  }

  /**
   * Crea un nuevo post
   */
  async createPost(data: CreatePostData): Promise<{
    success: boolean;
    data: PostWithDetails;
  }> {
    console.warn("Creating post with data:", data);
    return apiService.request("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Actualiza un post existente
   */
  async updatePost(
    slug: string,
    data: UpdatePostData
  ): Promise<{
    success: boolean;
    data: PostWithDetails;
  }> {
    return apiService.request(`/posts/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Elimina un post
   */
  async deletePost(slug: string): Promise<{
    success: boolean;
    data: null;
  }> {
    return apiService.request(`/posts/${slug}`, {
      method: "DELETE",
    });
  }
}

// Instancia singleton
export const postService = new PostService();
