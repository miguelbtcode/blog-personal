// src/backend/controllers/posts.controller.ts - Usando el service con cache
import { NextRequest } from "next/server";
import { PostsService } from "../services/posts.service";
import { createResponse } from "../utils/response";
import { validateRequest } from "../middleware/validation";
import {
  createPostSchema,
  postFiltersSchema,
  updatePostSchema,
} from "@/shared/schemas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export class PostsController {
  private postsService = new PostsService();

  /**
   * Obtener lista de posts con filtros
   */
  async getPosts(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const filters: Record<string, string> = {};

      // Convertir searchParams a objeto
      searchParams.forEach((value, key) => {
        filters[key] = value;
      });

      // Validar parámetros
      const validatedFilters = postFiltersSchema.parse(filters);
      const result = await this.postsService.getPosts(validatedFilters);

      const response = createResponse.success(result);

      // Headers de cache para CDN
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=300, stale-while-revalidate=600"
      );
      response.headers.set("CDN-Cache-Control", "public, s-maxage=300");

      return response;
    } catch (error) {
      console.error("GET /api/posts error:", error);
      return createResponse.error(error);
    }
  }

  async getPostById(id: string) {
    try {
      const post = await this.postsService.getPostById(id);
      const response = createResponse.success(post);

      response.headers.set(
        "Cache-Control",
        "public, s-maxage=600, stale-while-revalidate=1200"
      );
      response.headers.set("CDN-Cache-Control", "public, s-maxage=600");

      return response;
    } catch (error) {
      console.error(`GET /api/posts/${id} error:`, error);
      return createResponse.error(error);
    }
  }

  /**
   * Obtener post individual por slug
   */
  async getPostBySlug(slug: string) {
    try {
      const post = await this.postsService.getPostBySlug(slug);
      const response = createResponse.success(post);

      response.headers.set(
        "Cache-Control",
        "public, s-maxage=600, stale-while-revalidate=1200"
      );
      response.headers.set("CDN-Cache-Control", "public, s-maxage=600");

      return response;
    } catch (error) {
      console.error(`GET /api/posts/slug/${slug} error:`, error);
      return createResponse.error(error);
    }
  }

  /**
   * Crear nuevo post
   */
  async createPost(request: NextRequest) {
    try {
      const data = await validateRequest(createPostSchema)(request);

      // Obtener authorId desde la sesión/token (implementar según tu auth)
      const authorId = await this.getAuthorIdFromRequest(request);
      if (!authorId) {
        return createResponse.error(
          new Error("Usuario no autenticado"),
          "No autorizado",
          401
        );
      }

      const post = await this.postsService.createPost({
        ...data,
        authorId,
      });

      return createResponse.success(post, "Post creado exitosamente", 201);
    } catch (error) {
      console.error("POST /api/posts error:", error);
      return createResponse.error(error);
    }
  }

  /**
   * Actualizar post existente
   */
  async updatePost(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const body = await request.json();
      const validatedData = updatePostSchema.parse(body);

      // Verificar permisos (el usuario puede editar este post)
      const canEdit = await this.canEditPost(request, params.id);
      if (!canEdit) {
        return createResponse.error(
          new Error("Sin permisos para editar este post"),
          403
        );
      }

      const post = await this.postsService.updatePost(params.id, validatedData);

      return createResponse.success(post, "Post actualizado exitosamente");
    } catch (error) {
      console.error(`PUT /api/posts/${params.id} error:`, error);
      return createResponse.error(error);
    }
  }

  /**
   * Eliminar post
   */
  async deletePost(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      // Verificar permisos
      const canDelete = await this.canEditPost(request, params.id);
      if (!canDelete) {
        return createResponse.error(
          new Error("Sin permisos para eliminar este post"),
          "No autorizado",
          403
        );
      }

      await this.postsService.deletePost(params.id);

      return createResponse.success(null, "Post eliminado exitosamente");
    } catch (error) {
      console.error(`DELETE /api/posts/${params.id} error:`, error);
      return createResponse.error(error);
    }
  }

  /**
   * Obtener posts por autor
   */
  async getPostsByAuthor(
    request: NextRequest,
    { params }: { params: { authorId: string } }
  ) {
    try {
      const { searchParams } = new URL(request.url);
      const filters: Record<string, string> = {};

      searchParams.forEach((value, key) => {
        filters[key] = value;
      });

      const validatedFilters = postFiltersSchema.parse(filters);
      const result = await this.postsService.getPostsByAuthor(
        params.authorId,
        validatedFilters
      );

      const response = createResponse.success(result);
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=300, stale-while-revalidate=600"
      );

      return response;
    } catch (error) {
      console.error(`GET /api/posts/author/${params.authorId} error:`, error);
      return createResponse.error(error);
    }
  }

  /**
   * Obtener posts relacionados
   */
  async getRelatedPosts(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get("limit") || "5");

      // Obtener el post para extraer categorías y tags
      const post = await this.postsService.getPostById(params.id);
      if (!post) {
        return createResponse.error(
          new Error("Post no encontrado"),
          "No encontrado",
          404
        );
      }

      const categoryIds = post.categories?.map((c: any) => c.id) || [];
      const tagIds = post.tags?.map((t: any) => t.id) || [];

      const relatedPosts = await this.postsService.getRelatedPosts(
        params.id,
        categoryIds,
        tagIds,
        limit
      );

      const response = createResponse.success(relatedPosts);
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=600, stale-while-revalidate=1200"
      );

      return response;
    } catch (error) {
      console.error(`GET /api/posts/${params.id}/related error:`, error);
      return createResponse.error(error);
    }
  }

  /**
   * Endpoint para estadísticas de cache (solo desarrollo/admin)
   */
  async getCacheStats(request: NextRequest) {
    try {
      // Verificar que sea admin o desarrollo
      if (process.env.NODE_ENV !== "development") {
        const isAdmin = await this.isAdmin(request);
        if (!isAdmin) {
          return createResponse.error(
            new Error("No autorizado"),
            "No autorizado",
            403
          );
        }
      }

      const stats = this.postsService.getCacheStats();
      return createResponse.success(stats);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  /**
   * Endpoint para limpiar cache (solo admin)
   */
  async clearCache(request: NextRequest) {
    try {
      const isAdmin = await this.isAdmin(request);
      if (!isAdmin) {
        return createResponse.error(
          new Error("No autorizado"),
          "No autorizado",
          403
        );
      }

      this.postsService.clearAllCaches();
      return createResponse.success(null, "Cache limpiado exitosamente");
    } catch (error) {
      return createResponse.error(error);
    }
  }

  // Métodos privados de utilidad
  private async getAuthorIdFromRequest(
    request: NextRequest
  ): Promise<string | null> {
    try {
      const session = await getServerSession(authOptions);
      return session?.user?.id || null;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  }

  private async canEditPost(
    request: NextRequest,
    postId: string
  ): Promise<boolean> {
    try {
      const authorId = await this.getAuthorIdFromRequest(request);
      if (!authorId) return false;

      const post = await this.postsService.getPostById(postId);
      if (!post) return false;

      // El usuario puede editar si es el autor o es admin
      const isAuthor = post.authorId === authorId;
      const isAdmin = await this.isAdmin(request);

      return isAuthor || isAdmin;
    } catch {
      return false;
    }
  }

  private async isAdmin(request: NextRequest): Promise<boolean> {
    // Implementar verificación de admin según tu sistema
    try {
      const authorId = await this.getAuthorIdFromRequest(request);
      if (!authorId) return false;

      // Verificar rol de admin en base de datos
      // const user = await userService.getById(authorId);
      // return user?.role === 'ADMIN';

      return false; // Placeholder
    } catch {
      return false;
    }
  }
}
