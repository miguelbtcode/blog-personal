import {
  PostFiltersInput,
  CreatePostInput,
  UpdatePostInput,
} from "@/shared/schemas";
import { BaseRepository } from "./base.repository";
import { PostStatus } from "@/shared/enums";

export class PostsRepository extends BaseRepository {
  //* Done
  async findMany(params: PostFiltersInput) {
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

  async findBySlug(slug: string, includeComments: boolean = false) {
    const includeOptions = includeComments
      ? {
          ...this.getPostIncludes(),
          comments: {
            where: { status: "APPROVED", parentId: null },
            include: {
              author: { select: { id: true, name: true, image: true } },
              replies: {
                where: { status: "APPROVED" },
                include: {
                  author: { select: { id: true, name: true, image: true } },
                },
                orderBy: { createdAt: "asc" },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        }
      : this.getPostIncludes();

    return this.db.post.findUnique({
      where: { slug },
      include: includeOptions,
    });
  }

  async findById(id: string) {
    return this.db.post.findUnique({
      where: { id },
      include: this.getPostIncludes(),
    });
  }

  async create(
    data: CreatePostInput & { authorId: string; slug: string; readTime: number }
  ) {
    return this.db.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        content: data.content,
        featuredImage: data.featuredImage || null,
        status: data.status || "DRAFT",
        authorId: data.authorId,
        readTime: data.readTime,

        // Optional fields
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,

        // Handle categories relationship
        ...(data.categoryIds &&
          data.categoryIds.length > 0 && {
            categories: {
              create: data.categoryIds.map((categoryId: string) => ({
                category: { connect: { id: categoryId } },
              })),
            },
          }),

        // Handle tags relationship
        ...(data.tagIds &&
          data.tagIds.length > 0 && {
            tags: {
              create: data.tagIds.map((tagId: string) => ({
                tag: { connect: { id: tagId } },
              })),
            },
          }),
      },
      include: this.getPostIncludes(),
    });
  }

  async update(
    id: string,
    data: Partial<UpdatePostInput> & {
      slug?: string;
      readTime?: number;
      authorId?: string;
    }
  ) {
    const updateData: any = {
      ...(data.title && { title: data.title }),
      ...(data.slug && { slug: data.slug }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
      ...(data.content && { content: data.content }),
      ...(data.featuredImage !== undefined && {
        featuredImage: data.featuredImage,
      }),
      ...(data.status && { status: data.status }),
      ...(data.readTime !== undefined && { readTime: data.readTime }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
      ...(data.seoDescription !== undefined && {
        seoDescription: data.seoDescription,
      }),

      // Handle status change to PUBLISHED
      ...(data.status === "PUBLISHED" && { publishedAt: new Date() }),
    };

    // Handle categories update
    if (data.categoryIds !== undefined) {
      updateData.categories = {
        deleteMany: {},
        ...(data.categoryIds.length > 0 && {
          create: data.categoryIds.map((categoryId: string) => ({
            category: { connect: { id: categoryId } },
          })),
        }),
      };
    }

    // Handle tags update
    if (data.tagIds !== undefined) {
      updateData.tags = {
        deleteMany: {},
        ...(data.tagIds.length > 0 && {
          create: data.tagIds.map((tagId: string) => ({
            tag: { connect: { id: tagId } },
          })),
        }),
      };
    }

    return this.db.post.update({
      where: { id },
      data: updateData,
      include: this.getPostIncludes(),
    });
  }

  async delete(id: string) {
    // Delete related records first due to foreign key constraints
    await this.db.$transaction([
      // Delete categories relationship
      this.db.postCategory.deleteMany({
        where: { postId: id },
      }),
      // Delete tags relationship
      this.db.postTag.deleteMany({
        where: { postId: id },
      }),
      // Delete comments
      this.db.comment.deleteMany({
        where: { postId: id },
      }),
      // Finally delete the post
      this.db.post.delete({
        where: { id },
      }),
    ]);

    return true;
  }

  async incrementViewCount(id: string) {
    return this.db.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  async slugExists(slug: string, excludeId?: string) {
    const where: any = { slug };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const post = await this.db.post.findUnique({ where });
    return !!post;
  }

  async findByAuthor(authorId: string, params: Partial<PostFiltersInput> = {}) {
    const where = {
      ...this.buildWhereClause(params),
      authorId,
    };

    const skip = ((params.page || 1) - 1) * (params.limit || 10);
    const take = params.limit || 10;

    const [posts, total] = await Promise.all([
      this.db.post.findMany({
        where,
        include: this.getPostIncludes(),
        orderBy: this.buildOrderBy(
          params.sortBy || "createdAt",
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

  async findRelatedPosts(
    postId: string,
    categoryIds: string[] = [],
    tagIds: string[] = [],
    limit: number = 5
  ) {
    return this.db.post.findMany({
      where: {
        id: { not: postId },
        status: PostStatus.PUBLISHED,
        OR: [
          ...(categoryIds.length > 0
            ? [
                {
                  categories: {
                    some: {
                      categoryId: { in: categoryIds },
                    },
                  },
                },
              ]
            : []),
          ...(tagIds.length > 0
            ? [
                {
                  tags: {
                    some: {
                      tagId: { in: tagIds },
                    },
                  },
                },
              ]
            : []),
        ],
      },
      include: this.getPostIncludes(),
      orderBy: [{ publishedAt: "desc" }, { viewCount: "desc" }],
      take: limit,
    });
  }

  private buildWhereClause(params: PostFiltersInput) {
    const where: any = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { excerpt: { contains: params.search, mode: "insensitive" } },
        { content: { path: ["content"], string_contains: params.search } }, // JSON search
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

    return where;
  }

  private getPostIncludes() {
    return {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
        },
      },
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
            },
          },
        },
      },
      tags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      _count: {
        select: {
          comments: {
            where: {
              status: "APPROVED" as const,
            },
          },
        },
      },
    };
  }
}
