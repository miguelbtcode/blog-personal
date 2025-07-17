import { PostsRepository } from "../repositories/posts.repository";
import { generateSlug, calculateReadTime } from "@/lib/utils";
import { CreatePostData } from "@/types";

export class PostsService {
  private postsRepo = new PostsRepository();

  async getPosts(params: PostQueryParams) {
    return this.postsRepo.findMany(params);
  }

  async getPostBySlug(slug: string) {
    const post = await this.postsRepo.findBySlug(slug);

    if (!post) {
      throw new Error("Post no encontrado");
    }

    // Incrementar contador de vistas
    await this.postsRepo.incrementViewCount(post.id);

    return {
      ...post,
      viewCount: post.viewCount + 1,
    };
  }

  async createPost(data: CreatePostData) {
    const slug = await this.generateUniqueSlug(data.title);
    const readTime = calculateReadTime(data.content);

    const postData = {
      ...data,
      slug,
      readTime,
      published: data.status === "PUBLISHED",
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      categories: data.categoryIds
        ? {
            create: data.categoryIds.map((id: string) => ({ categoryId: id })),
          }
        : undefined,
      tags: data.tagIds
        ? {
            create: data.tagIds.map((id: string) => ({ tagId: id })),
          }
        : undefined,
    };

    return this.postsRepo.create(postData);
  }

  async updatePost(slug: string, data: UpdatePostData) {
    const existingPost = await this.postsRepo.findBySlug(slug);
    if (!existingPost) {
      throw new Error("Post no encontrado");
    }

    let newSlug = slug;
    if (data.title && data.title !== existingPost.title) {
      newSlug = await this.generateUniqueSlug(data.title);
    }

    let readTime = existingPost.readTime;
    if (data.content) {
      readTime = calculateReadTime(data.content);
    }

    const updateData = {
      ...data,
      slug: newSlug,
      readTime,
      publishedAt:
        data.status === "PUBLISHED" && !existingPost.published
          ? new Date()
          : existingPost.publishedAt,
      published: data.status === "PUBLISHED",
      categories: data.categoryIds
        ? {
            deleteMany: {},
            create: data.categoryIds.map((id: string) => ({ categoryId: id })),
          }
        : undefined,
      tags: data.tagIds
        ? {
            deleteMany: {},
            create: data.tagIds.map((id: string) => ({ tagId: id })),
          }
        : undefined,
    };

    return this.postsRepo.update(slug, updateData);
  }

  async deletePost(slug: string) {
    const post = await this.postsRepo.findBySlug(slug);
    if (!post) {
      throw new Error("Post no encontrado");
    }
    return this.postsRepo.delete(slug);
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (await this.postsRepo.findBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
