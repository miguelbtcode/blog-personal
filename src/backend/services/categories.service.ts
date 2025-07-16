import { Category } from "@/types/blog.types";
import { CategoriesRepository } from "../repositories/categories.repository";
import { generateSlug } from "@/lib/utils";

export class CategoriesService {
  private categoriesRepo = new CategoriesRepository();

  async getCategories() {
    const categories = await this.categoriesRepo.findMany();
    return categories.map((category: Category) => ({
      ...category,
      postCount: category.postCount || 0,
    }));
  }

  async createCategory(data: {
    name: string;
    description?: string;
    color?: string;
  }) {
    const slug = await this.generateUniqueSlug(data.name);
    return this.categoriesRepo.create({ ...data, slug });
  }

  async updateCategory(
    id: string,
    data: { name?: string; description?: string; color?: string }
  ) {
    const existing = await this.categoriesRepo.findById(id);
    if (!existing) {
      throw new Error("Categoría no encontrada");
    }

    let slug = existing.slug;
    if (data.name && data.name !== existing.name) {
      slug = await this.generateUniqueSlug(data.name);
    }

    return this.categoriesRepo.update(id, { ...data, slug });
  }

  async deleteCategory(id: string) {
    const category = await this.categoriesRepo.findById(id);
    if (!category) {
      throw new Error("Categoría no encontrada");
    }
    return this.categoriesRepo.delete(id);
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (await this.categoriesRepo.findBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
