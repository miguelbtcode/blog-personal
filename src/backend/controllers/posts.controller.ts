import { NextRequest } from "next/server";
import { PostsService } from "../services/posts.service";
import { createResponse } from "../utils/response";
import {
  postQuerySchema,
  createPostSchema,
  updatePostSchema,
} from "../validators/posts.validator";

export class PostsController {
  private postsService = new PostsService();

  async getPosts(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const params = postQuerySchema.parse(Object.fromEntries(searchParams));

      const result = await this.postsService.getPosts(params);

      return createResponse.success(result);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async getPost(
    request: NextRequest,
    { params }: { params: { slug: string } }
  ) {
    try {
      const post = await this.postsService.getPostBySlug(params.slug);
      return createResponse.success(post);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async createPost(request: NextRequest) {
    try {
      const body = await request.json();
      const validatedData = createPostSchema.parse(body);

      const post = await this.postsService.createPost(validatedData);

      return createResponse.success(post, "Post creado exitosamente", 201);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async updatePost(
    request: NextRequest,
    { params }: { params: { slug: string } }
  ) {
    try {
      const body = await request.json();
      const validatedData = updatePostSchema.parse(body);

      const post = await this.postsService.updatePost(
        params.slug,
        validatedData
      );

      return createResponse.success(post, "Post actualizado exitosamente");
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async deletePost(
    request: NextRequest,
    { params }: { params: { slug: string } }
  ) {
    try {
      await this.postsService.deletePost(params.slug);
      return createResponse.success(null, "Post eliminado exitosamente");
    } catch (error) {
      return createResponse.error(error);
    }
  }
}
