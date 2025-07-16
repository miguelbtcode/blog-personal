import { Tag } from "@/types/blog.types";
import { TagsRepository } from "../repositories/tags.repository";
import { generateSlug } from "@/lib/utils";

export class TagsService {
  private tagsRepo = new TagsRepository();

  async getTags() {
    const tags = await this.tagsRepo.findMany();
    return tags.map((tag: Tag) => ({
      ...tag,
      postCount: tag.postCount || 0,
    }));
  }

  async createTag(data: { name: string }) {
    const slug = await this.generateUniqueSlug(data.name);
    return this.tagsRepo.create({ ...data, slug });
  }

  async updateTag(id: string, data: { name: string }) {
    const existing = await this.tagsRepo.findById(id);
    if (!existing) {
      throw new Error("Tag no encontrado");
    }

    let slug = existing.slug;
    if (data.name && data.name !== existing.name) {
      slug = await this.generateUniqueSlug(data.name);
    }

    return this.tagsRepo.update(id, { ...data, slug });
  }

  async deleteTag(id: string) {
    const tag = await this.tagsRepo.findById(id);
    if (!tag) {
      throw new Error("Tag no encontrado");
    }
    return this.tagsRepo.delete(id);
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (await this.tagsRepo.findBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
