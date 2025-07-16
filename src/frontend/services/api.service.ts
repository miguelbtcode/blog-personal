// src/frontend/services/api.service.ts
import type { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import type {
  Post,
  Category,
  Tag,
  PostQueryParams,
} from "@/shared/types/blog.types";

class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/api${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Posts
  async getPosts(
    params: PostQueryParams = {}
  ): Promise<PaginatedResponse<Post>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = `/posts${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return this.request<{ items: Post[]; pagination: any }>(endpoint);
  }

  async getPost(slug: string): Promise<ApiResponse<Post>> {
    return this.request<Post>(`/posts/${slug}`);
  }

  async createPost(data: Partial<Post>): Promise<ApiResponse<Post>> {
    return this.request<Post>("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePost(
    slug: string,
    data: Partial<Post>
  ): Promise<ApiResponse<Post>> {
    return this.request<Post>(`/posts/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePost(slug: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/posts/${slug}`, {
      method: "DELETE",
    });
  }

  // Categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>("/categories");
  }

  async createCategory(
    data: Partial<Category>
  ): Promise<ApiResponse<Category>> {
    return this.request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCategory(
    id: string,
    data: Partial<Category>
  ): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/categories/${id}`, {
      method: "DELETE",
    });
  }

  // Tags
  async getTags(): Promise<ApiResponse<Tag[]>> {
    return this.request<Tag[]>("/tags");
  }

  async createTag(data: Partial<Tag>): Promise<ApiResponse<Tag>> {
    return this.request<Tag>("/tags", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTag(id: string, data: Partial<Tag>): Promise<ApiResponse<Tag>> {
    return this.request<Tag>(`/tags/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTag(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/tags/${id}`, {
      method: "DELETE",
    });
  }

  // Upload
  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.request<{ url: string }>("/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  // Stats
  async getStats(): Promise<ApiResponse<any>> {
    return this.request<any>("/posts/stats");
  }
}

export const apiService = new ApiService();
