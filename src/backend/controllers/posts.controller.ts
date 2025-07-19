import { NextRequest } from "next/server";
import { PostsService } from "../services/posts.service";
import { createResponse } from "../utils/response";
import {
  validateRequest,
  validateParams,
  validateQuery,
} from "../middleware/validation";
import {
  createPostSchema,
  updatePostSchema,
  postFiltersSchema,
  postParamsSchema,
  postSlugParamsSchema,
} from "@/shared/schemas";

export class PostsController {
  private postsService = new PostsService();

  /**
   * GET /api/posts - Obtener lista de posts con filtros
   */
  async getPosts(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const filters = validateQuery(postFiltersSchema, searchParams);

      const result = await this.postsService.getPosts(filters);
      return createResponse.success(result);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  /**
   * GET /api/posts/[slug] - Obtener post por slug (PARA BLOG PÚBLICO)
   */
  async getPost(
    request: NextRequest,
    { params }: { params: { slug: string } }
  ) {
    try {
      const { slug } = validateParams(postSlugParamsSchema, params);

      const post = await this.postsService.getPostBySlug(slug);
      return createResponse.success(post);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  /**
   * GET /api/posts/id/[id] - Obtener post por ID (PARA EDICIÓN/ADMIN)
   */
  async getPostById(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = validateParams(postParamsSchema, params);

      const post = await this.postsService.getPostById(id);
      return createResponse.success(post);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  /**
   * POST /api/posts - Crear nuevo post
   */
  async createPost(request: NextRequest) {
    try {
      const validatedData = await validateRequest(createPostSchema)(request);

      const post = await this.postsService.createPost(validatedData);
      return createResponse.success(post, "Post creado exitosamente", 201);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  /**
   * PUT /api/posts/[id] - Actualizar post
   */
  async updatePost(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = validateParams(postParamsSchema, params);
      const validatedData = await validateRequest(updatePostSchema)(request);

      const post = await this.postsService.updatePost(id, validatedData);
      return createResponse.success(post, "Post actualizado exitosamente");
    } catch (error) {
      return createResponse.error(error);
    }
  }

  /**
   * DELETE /api/posts/[id] - Eliminar post
   */
  async deletePost(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = validateParams(postParamsSchema, params);

      await this.postsService.deletePost(id);
      return createResponse.success(null, "Post eliminado exitosamente");
    } catch (error) {
      return createResponse.error(error);
    }
  }

  /**
   * GET /api/posts/author/[authorId] - Obtener posts de un autor
   */
  async getPostsByAuthor(
    request: NextRequest,
    { params }: { params: { authorId: string } }
  ) {
    try {
      const { authorId } = validateParams(postParamsSchema, {
        id: params.authorId,
      });
      const { searchParams } = new URL(request.url);
      const filters = validateQuery(postFiltersSchema, searchParams);

      const result = await this.postsService.getPostsByAuthor(
        authorId,
        filters
      );
      return createResponse.success(result);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  /**
   * GET /api/posts/[id]/related - Obtener posts relacionados
   */
  async getRelatedPosts(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = validateParams(postParamsSchema, params);
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get("limit") || "5");

      const posts = await this.postsService.getRelatedPosts(id, limit);
      return createResponse.success(posts);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  /**
   * PATCH /api/posts/[id]/publish - Publicar borrador
   */
  async publishPost(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = validateParams(postParamsSchema, params);

      const post = await this.postsService.publishDraft(id);
      return createResponse.success(post, "Post publicado exitosamente");
    } catch (error) {
      return createResponse.error(error);
    }
  }

  /**
   * PATCH /api/posts/[id]/unpublish - Convertir a borrador
   */
  async unpublishPost(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = validateParams(postParamsSchema, params);

      const post = await this.postsService.unpublishPost(id);
      return createResponse.success(post, "Post convertido a borrador");
    } catch (error) {
      return createResponse.error(error);
    }
  }
}
