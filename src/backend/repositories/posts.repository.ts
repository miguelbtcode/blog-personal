// src/backend/repositories/posts.repository.ts - Versión optimizada sin cache
import {
  PostFiltersInput,
  CreatePostInput,
  UpdatePostInput,
} from "@/shared/schemas";
import { BaseRepository } from "./base.repository";
import { PostStatus } from "@/shared/enums";

export class PostsRepository extends BaseRepository {
  /**
   * Buscar múltiples posts con filtros optimizados
   */
  async findMany(params: PostFiltersInput) {
    const where = this.buildWhereClause(params);
    const skip = ((params.page || 1) - 1) * (params.limit || 10);
    const take = params.limit || 10;

    // Query paralela para optimizar performance
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
      items: posts.map(this.transformPost),
      pagination: this.buildPagination(params, total),
    };
  }

  /**
   * Buscar post por slug con includes opcionales
   */
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

    const post = await this.db.post.findUnique({
      where: { slug },
      include: includeOptions,
    });

    return post ? this.transformPost(post) : null;
  }

  /**
   * Buscar post por ID
   */
  async findById(id: string) {
    const post = await this.db.post.findUnique({
      where: { id },
      include: this.getPostIncludes(),
    });

    return post ? this.transformPost(post) : null;
  }

  /**
   * Crear nuevo post con manejo de relaciones
   */
  async create(
    data: CreatePostInput & {
      authorId: string;
      slug: string;
      readTime: number;
    }
  ) {
    const post = await this.db.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        content: data.content,
        featuredImage: data.featuredImage || null,
        status: data.status || PostStatus.DRAFT,
        authorId: data.authorId,
        readTime: data.readTime,

        // Campos SEO opcionales
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        publishedAt: data.status === PostStatus.PUBLISHED ? new Date() : null,

        // Relaciones de categorías
        ...(data.categoryIds &&
          data.categoryIds.length > 0 && {
            categories: {
              create: data.categoryIds.map((categoryId: string) => ({
                category: { connect: { id: categoryId } },
              })),
            },
          }),

        // Relaciones de tags
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

    return this.transformPost(post);
  }

  /**
   * Actualizar post existente
   */
  async update(
    id: string,
    data: Partial<UpdatePostInput> & {
      slug?: string;
      readTime?: number;
    }
  ) {
    const updateData: any = {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.featuredImage !== undefined && {
        featuredImage: data.featuredImage,
      }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.readTime !== undefined && { readTime: data.readTime }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
      ...(data.seoDescription !== undefined && {
        seoDescription: data.seoDescription,
      }),

      // Actualizar publishedAt si cambia a PUBLISHED
      ...(data.status === PostStatus.PUBLISHED && {
        publishedAt: new Date(),
      }),
    };

    // Manejar actualización de categorías
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

    // Manejar actualización de tags
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

    const post = await this.db.post.update({
      where: { id },
      data: updateData,
      include: this.getPostIncludes(),
    });

    return this.transformPost(post);
  }

  /**
   * Eliminar post con limpieza de relaciones
   */
  async delete(id: string) {
    // Usar transacción para eliminar relaciones primero
    await this.db.$transaction([
      // Eliminar relaciones de categorías
      this.db.postCategory.deleteMany({
        where: { postId: id },
      }),
      // Eliminar relaciones de tags
      this.db.postTag.deleteMany({
        where: { postId: id },
      }),
      // Eliminar comentarios
      this.db.comment.deleteMany({
        where: { postId: id },
      }),
      // Finalmente eliminar el post
      this.db.post.delete({
        where: { id },
      }),
    ]);

    return true;
  }

  /**
   * Incrementar contador de vistas
   */
  async incrementViewCount(id: string) {
    return this.db.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      select: { id: true, viewCount: true }, // Solo seleccionar campos necesarios
    });
  }

  /**
   * Verificar si existe un slug
   */
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const where: any = { slug };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const post = await this.db.post.findUnique({
      where,
      select: { id: true }, // Solo seleccionar ID para optimizar
    });

    return !!post;
  }

  /**
   * Buscar posts por autor
   */
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
      items: posts.map(this.transformPost),
      pagination: this.buildPagination(params, total),
    };
  }

  /**
   * Buscar posts relacionados
   */
  async findRelatedPosts(
    postId: string,
    categoryIds: string[] = [],
    tagIds: string[] = [],
    limit: number = 5
  ) {
    const posts = await this.db.post.findMany({
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

    return posts.map(this.transformPost);
  }

  // Métodos privados de utilidad

  private buildWhereClause(params: PostFiltersInput) {
    const where: any = {};

    // Filtro por status
    if (params.status) {
      where.status = params.status;
    }

    // Búsqueda de texto
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { excerpt: { contains: params.search, mode: "insensitive" } },
        { content: { contains: params.search, mode: "insensitive" } },
      ];
    }

    // Filtro por categoría
    if (params.category) {
      where.categories = {
        some: { category: { slug: params.category } },
      };
    }

    // Filtro por tag
    if (params.tag) {
      where.tags = {
        some: { tag: { slug: params.tag } },
      };
    }

    // Filtro por rango de fechas
    if (params.dateFrom || params.dateTo) {
      where.publishedAt = {};
      if (params.dateFrom) {
        where.publishedAt.gte = new Date(params.dateFrom);
      }
      if (params.dateTo) {
        where.publishedAt.lte = new Date(params.dateTo);
      }
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

  /**
   * Transformar post desde DB a formato de respuesta
   */
  private transformPost(post: any) {
    return {
      ...post,
      categories: post.categories?.map((pc: any) => pc.category) || [],
      tags: post.tags?.map((pt: any) => pt.tag) || [],
      commentsCount: post._count?.comments || 0,
      published: post.status === PostStatus.PUBLISHED,
    };
  }
}
