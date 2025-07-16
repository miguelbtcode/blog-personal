import { NextRequest } from "next/server";
import { PostsService } from "../services/posts.service";
import { createResponse } from "../utils/response";
import {
  createPostSchema,
  updatePostSchema,
  postFiltersSchema,
} from "@/lib/validations";
import { PostStatus } from "@/shared/enums";

export class PostsController {
  private postsService = new PostsService();

  async getPosts(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const filters: Record<string, string> = {};

      searchParams.forEach((value, key) => {
        filters[key] = value;
      });

      const validatedFilters = postFiltersSchema.parse(filters);
      const result = await this.postsService.getPosts(validatedFilters);

      return createResponse.success(result);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async getPost(slug: string) {
    try {
      const post = await this.postsService.getPostBySlug(slug);
      return createResponse.success(post);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async createPost(request: NextRequest) {
    try {
      const body = await request.json();
      const validatedData = createPostSchema.parse(body);

      const authorId = body.authorId || "default-author-id";

      const postData = {
        ...validatedData,
        authorId,
        status: validatedData.status as PostStatus,
      };

      const post = await this.postsService.createPost(postData);
      return createResponse.success(post, "Post creado exitosamente", 201);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async updatePost(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const body = await request.json();
      const validatedData = updatePostSchema.parse({ ...body, id: params.id });

      const post = await this.postsService.updatePost(params.id, validatedData);
      return createResponse.success(post, "Post actualizado exitosamente");
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async deletePost(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      await this.postsService.deletePost(params.id);
      return createResponse.success(null, "Post eliminado exitosamente");
    } catch (error) {
      return createResponse.error(error);
    }
  }
}
