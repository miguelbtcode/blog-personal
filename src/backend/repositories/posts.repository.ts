import { BaseRepository } from "./base.repository";
import type { PostQueryParams } from "@/backend/validators/posts.validator";
import { PostStatus } from "@/shared/enums";

export class PostsRepository extends BaseRepository {
  async findMany(params: PostQueryParams) {
    const where = this.buildWhereClause(params);
    const skip = ((params.page || 1) - 1) * (params.limit || 10);
    const take = params.limit || 10;

    const [posts, total] = await Promise.all([
      this.db.post.findMany({
        where,
        include: this.getPostIncludes(),
        orderBy: this.buildOrderBy(
          params.sortBy || "publishedAt",
          params.sortOrder
        ),
        skip,
        take,
      }),
      this.db.post.count({ where }),
    ]);

    return {
      items: posts,
      pagination: this.buildPagination(params, total),
    };
  }

  async findBySlug(slug: string) {
    return this.db.post.findUnique({
      where: { slug },
      include: {
        ...this.getPostIncludes(),
        comments: {
          where: { status: "APPROVED", parentId: null },
          include: {
            author: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async create(data: any) {
    return this.db.post.create({
      data,
      include: this.getPostIncludes(),
    });
  }

  async update(slug: string, data: any) {
    return this.db.post.update({
      where: { slug },
      data,
      include: this.getPostIncludes(),
    });
  }

  async delete(slug: string) {
    return this.db.post.delete({ where: { slug } });
  }

  async incrementViewCount(id: string) {
    return this.db.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  private buildWhereClause(params: PostQueryParams) {
    const where: any = {};

    if (params.status) {
      where.status = params.status;
    } else {
      where.status = PostStatus.PUBLISHED;
      where.published = true;
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { excerpt: { contains: params.search, mode: "insensitive" } },
        { content: { contains: params.search, mode: "insensitive" } },
      ];
    }

    if (params.category) {
      where.categories = {
        some: { category: { slug: params.category } },
      };
    }

    if (params.tag) {
      where.tags = {
        some: { tag: { slug: params.tag } },
      };
    }

    if (params.authorId) {
      where.authorId = params.authorId;
    }

    return where;
  }

  private getPostIncludes() {
    return {
      author: { select: { id: true, name: true, image: true, bio: true } },
      categories: {
        include: {
          category: {
            select: { id: true, name: true, slug: true, color: true },
          },
        },
      },
      tags: {
        include: { tag: { select: { id: true, name: true, slug: true } } },
      },
      _count: {
        select: { comments: { where: { status: "APPROVED" } } },
      },
    };
  }
}
