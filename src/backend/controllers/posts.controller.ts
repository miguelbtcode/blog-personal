import { NextRequest } from "next/server";
import { PostsService } from "../services/posts.service";
import { createResponse } from "../utils/response";
import { validateRequest } from "../middleware/validation";
import { postFiltersSchema } from "../validators";

export class PostsController {
  private postsService = new PostsService();

  //* Done
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

  //TODO: Pending
  async getPost(slug: string) {
    try {
      const post = await this.postsService.getPostBySlug(slug);
      return createResponse.success(post);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  //* Implementar lógica de creación de post
  //TODO: Implementar la logica de subida de imagenes a cloudinary y guardar la url en la base de datos
  //TODO: Implementar la logica y control de validaciones de campos si algo no es valido
  async createPost(request: NextRequest) {
    const data = await validateRequest(createPostSchema)(request);
    const post = await this.postsService.createPost(data);
    return createResponse.success(post, "Post creado exitosamente", 201);
  }

  //TODO: Implementar lógica de actualización de post
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

  //TODO: Implementar lógica de eliminación de post
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
