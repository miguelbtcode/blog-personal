import { apiService } from "./api.service";
import type {
  ApiResponse,
  PaginatedResponse,
  Post,
  PostWithDetails,
  PostFilters,
  CreatePostData,
  UpdatePostData,
  DashboardStats,
} from "@/types";

export class PostService {
  /**
   * Obtiene lista paginada de posts con filtros
   */
  async getPosts(filters: PostFilters = {}): Promise<PaginatedResponse<Post>> {
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = `/posts${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return apiService.request<PaginatedResponse<Post>>(endpoint);
  }

  /**
   * Obtiene un post por slug con detalles completos
   */
  async getPostBySlug(slug: string): Promise<ApiResponse<PostWithDetails>> {
    return apiService.request<ApiResponse<PostWithDetails>>(
      `/posts/slug/${slug}`
    );
  }

  /**
   * Obtiene un post por ID
   */
  async getPostById(id: string): Promise<ApiResponse<PostWithDetails>> {
    return apiService.request<ApiResponse<PostWithDetails>>(`/posts/${id}`);
  }

  /**
   * Crea un nuevo post
   */
  async createPost(data: CreatePostData): Promise<ApiResponse<Post>> {
    return apiService.request<ApiResponse<Post>>("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Actualiza un post existente
   */
  async updatePost(
    id: string,
    data: UpdatePostData
  ): Promise<ApiResponse<Post>> {
    return apiService.request<ApiResponse<Post>>(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Elimina un post
   */
  async deletePost(id: string): Promise<ApiResponse<null>> {
    return apiService.request<ApiResponse<null>>(`/posts/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Publica un post (cambia status a PUBLISHED)
   */
  async publishPost(id: string): Promise<ApiResponse<Post>> {
    return apiService.request<ApiResponse<Post>>(`/posts/${id}/publish`, {
      method: "PATCH",
    });
  }

  /**
   * Archiva un post (cambia status a ARCHIVED)
   */
  async archivePost(id: string): Promise<ApiResponse<Post>> {
    return apiService.request<ApiResponse<Post>>(`/posts/${id}/archive`, {
      method: "PATCH",
    });
  }

  /**
   * Obtiene posts relacionados basados en categorías y tags
   */
  async getRelatedPosts(
    postId: string,
    limit: number = 4
  ): Promise<ApiResponse<Post[]>> {
    return apiService.request<ApiResponse<Post[]>>(
      `/posts/${postId}/related?limit=${limit}`
    );
  }

  /**
   * Obtiene posts populares por vistas
   */
  async getPopularPosts(limit: number = 5): Promise<ApiResponse<Post[]>> {
    return apiService.request<ApiResponse<Post[]>>(
      `/posts/popular?limit=${limit}`
    );
  }

  /**
   * Obtiene posts recientes
   */
  async getRecentPosts(limit: number = 5): Promise<ApiResponse<Post[]>> {
    return apiService.request<ApiResponse<Post[]>>(
      `/posts/recent?limit=${limit}`
    );
  }

  /**
   * Obtiene posts destacados
   */
  async getFeaturedPosts(limit: number = 3): Promise<ApiResponse<Post[]>> {
    return apiService.request<ApiResponse<Post[]>>(
      `/posts/featured?limit=${limit}`
    );
  }

  /**
   * Busca posts por término
   */
  async searchPosts(
    query: string,
    filters: Partial<PostFilters> = {}
  ): Promise<PaginatedResponse<Post>> {
    const searchParams = new URLSearchParams({
      search: query,
      ...Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [
          key,
          value?.toString() || "",
        ])
      ),
    });

    return apiService.request<PaginatedResponse<Post>>(
      `/posts/search?${searchParams.toString()}`
    );
  }

  /**
   * Incrementa el contador de vistas de un post
   */
  async incrementViewCount(
    id: string
  ): Promise<ApiResponse<{ viewCount: number }>> {
    return apiService.request<ApiResponse<{ viewCount: number }>>(
      `/posts/${id}/view`,
      {
        method: "POST",
      }
    );
  }

  /**
   * Obtiene estadísticas de un post específico
   */
  async getPostStats(id: string): Promise<
    ApiResponse<{
      viewCount: number;
      commentCount: number;
      readTime: number;
    }>
  > {
    return apiService.request<
      ApiResponse<{
        viewCount: number;
        commentCount: number;
        readTime: number;
      }>
    >(`/posts/${id}/stats`);
  }

  /**
   * Obtiene estadísticas generales del blog
   */
  async getBlogStats(): Promise<ApiResponse<DashboardStats>> {
    return apiService.request<ApiResponse<DashboardStats>>("/posts/stats");
  }

  /**
   * Duplica un post (crea una copia como borrador)
   */
  async duplicatePost(id: string): Promise<ApiResponse<Post>> {
    return apiService.request<ApiResponse<Post>>(`/posts/${id}/duplicate`, {
      method: "POST",
    });
  }

  /**
   * Obtiene el historial de versiones de un post
   */
  async getPostVersions(id: string): Promise<ApiResponse<Post[]>> {
    return apiService.request<ApiResponse<Post[]>>(`/posts/${id}/versions`);
  }

  /**
   * Programa la publicación de un post
   */
  async schedulePost(
    id: string,
    publishAt: string
  ): Promise<ApiResponse<Post>> {
    return apiService.request<ApiResponse<Post>>(`/posts/${id}/schedule`, {
      method: "PATCH",
      body: JSON.stringify({ publishAt }),
    });
  }

  /**
   * Añade categorías a un post
   */
  async addCategoriesToPost(
    postId: string,
    categoryIds: string[]
  ): Promise<ApiResponse<Post>> {
    return apiService.request<ApiResponse<Post>>(
      `/posts/${postId}/categories`,
      {
        method: "POST",
        body: JSON.stringify({ categoryIds }),
      }
    );
  }

  /**
   * Remueve categorías de un post
   */
  async removeCategoriesFromPost(
    postId: string,
    categoryIds: string[]
  ): Promise<ApiResponse<Post>> {
    return apiService.request<ApiResponse<Post>>(
      `/posts/${postId}/categories`,
      {
        method: "DELETE",
        body: JSON.stringify({ categoryIds }),
      }
    );
  }

  /**
   * Añade tags a un post
   */
  async addTagsToPost(
    postId: string,
    tagIds: string[]
  ): Promise<ApiResponse<Post>> {
    return apiService.request<ApiResponse<Post>>(`/posts/${postId}/tags`, {
      method: "POST",
      body: JSON.stringify({ tagIds }),
    });
  }

  /**
   * Remueve tags de un post
   */
  async removeTagsFromPost(
    postId: string,
    tagIds: string[]
  ): Promise<ApiResponse<Post>> {
    return apiService.request<ApiResponse<Post>>(`/posts/${postId}/tags`, {
      method: "DELETE",
      body: JSON.stringify({ tagIds }),
    });
  }

  /**
   * Exporta posts en formato específico
   */
  async exportPosts(
    format: "json" | "csv" | "xml",
    filters: PostFilters = {}
  ): Promise<Blob> {
    const searchParams = new URLSearchParams({
      format,
      ...Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [
          key,
          value?.toString() || "",
        ])
      ),
    });

    const response = await fetch(
      `${apiService["baseURL"]}/posts/export?${searchParams.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Obtiene sugerencias de títulos basados en contenido
   */
  async getTitleSuggestions(content: string): Promise<ApiResponse<string[]>> {
    return apiService.request<ApiResponse<string[]>>(
      "/posts/title-suggestions",
      {
        method: "POST",
        body: JSON.stringify({ content }),
      }
    );
  }

  /**
   * Genera extracto automático desde el contenido
   */
  async generateExcerpt(
    content: string,
    maxLength: number = 160
  ): Promise<ApiResponse<string>> {
    return apiService.request<ApiResponse<string>>("/posts/generate-excerpt", {
      method: "POST",
      body: JSON.stringify({ content, maxLength }),
    });
  }

  /**
   * Valida slug de post (verifica disponibilidad)
   */
  async validateSlug(
    slug: string,
    excludeId?: string
  ): Promise<ApiResponse<{ isAvailable: boolean }>> {
    const params = new URLSearchParams({ slug });
    if (excludeId) params.append("excludeId", excludeId);

    return apiService.request<ApiResponse<{ isAvailable: boolean }>>(
      `/posts/validate-slug?${params.toString()}`
    );
  }

  /**
   * Genera slug automático desde título
   */
  async generateSlug(title: string): Promise<ApiResponse<string>> {
    return apiService.request<ApiResponse<string>>("/posts/generate-slug", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  }
}

// Instancia singleton
export const postService = new PostService();
