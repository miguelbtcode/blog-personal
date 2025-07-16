import { NextRequest } from "next/server";
import { CategoriesService } from "../services/categories.service";
import { createResponse } from "../utils/response";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre es muy largo"),
  description: z.string().max(500, "La descripción es muy larga").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color debe ser hex válido")
    .optional(),
});

export class CategoriesController {
  private categoriesService = new CategoriesService();

  async getCategories() {
    try {
      const categories = await this.categoriesService.getCategories();
      return createResponse.success(categories);
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async createCategory(request: NextRequest) {
    try {
      const body = await request.json();
      const validatedData = createCategorySchema.parse(body);

      const category = await this.categoriesService.createCategory(
        validatedData
      );

      return createResponse.success(
        category,
        "Categoría creada exitosamente",
        201
      );
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async updateCategory(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const body = await request.json();
      const validatedData = createCategorySchema.partial().parse(body);

      const category = await this.categoriesService.updateCategory(
        params.id,
        validatedData
      );

      return createResponse.success(
        category,
        "Categoría actualizada exitosamente"
      );
    } catch (error) {
      return createResponse.error(error);
    }
  }

  async deleteCategory(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      await this.categoriesService.deleteCategory(params.id);
      return createResponse.success(null, "Categoría eliminada exitosamente");
    } catch (error) {
      return createResponse.error(error);
    }
  }
}
