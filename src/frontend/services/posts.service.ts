import {
  ApiResponse,
  CreatePostData,
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
   * Obtiene un post por ID (para edición/admin) - SIN incrementar vistas
   */
  async getPost(id: string): Promise<{
    success: boolean;
    data: PostWithDetails;
    error?: string | undefined;
  }> {
    return apiService.request(`/posts/${id}`);
  }

  /**
   * Obtiene un post por slug con detalles completos (para blog público) - Incrementa vistas
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
   * Actualiza un post existente por ID
   */
  async updatePost(
    id: string,
    data: UpdatePostData
  ): Promise<{
    success: boolean;
    data: PostWithDetails;
  }> {
    return apiService.request(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Elimina un post por ID
   */
  async deletePost(id: string): Promise<{
    success: boolean;
    data: null;
  }> {
    return apiService.request(`/posts/${id}`, {
      method: "DELETE",
    });
  }
}

// Instancia singleton
export const postService = new PostService();
