import { NextRequest } from "next/server";
import { TagsService } from "../services/tags.service";
import { createResponse } from "../utils/response";
import { z } from "zod";

const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(30, "El nombre es muy largo"),
});

export class TagsController {
  private tagsService = new TagsService();

  async getTags() {
    try {
      const tags = await this.tagsService.getTags();
      return createResponse.success(tags);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async createTag(request: NextRequest) {
    try {
      const body = await request.json();
      const validatedData = createTagSchema.parse(body);

      const tag = await this.tagsService.createTag(validatedData);

      return createResponse.success(tag, "Tag creado exitosamente", 201);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async updateTag(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const body = await request.json();
      const validatedData = createTagSchema.partial().parse(body);

      const tag = await this.tagsService.updateTag(params.id, validatedData);

      return createResponse.success(tag, "Tag actualizado exitosamente");
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async deleteTag(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      await this.tagsService.deleteTag(params.id);
      return createResponse.success(null, "Tag eliminado exitosamente");
    } catch (error) {
      return createResponse.error(error);
    }
  }
}
