import { PostsRepository } from "../repositories/posts.repository";
import { generateSlug, calculateReadTime } from "@/lib/utils";
import {
  PostFiltersInput,
  CreatePostInput,
  UpdatePostInput,
} from "@/shared/schemas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validatePostContent } from "@/lib/blockUtils";
import { PostStatus } from "@/shared/enums";

export class PostsService {
  private postsRepo = new PostsRepository();

  /**
   * Obtener lista de posts con filtros
   */
  async getPosts(params: PostFiltersInput) {
    return await this.postsRepo.findMany(params);
  }

  /**
   * Obtener post por slug e incrementar contador de vistas (PARA BLOG PÚBLICO)
   */
  async getPostBySlug(slug: string, includeComments: boolean = true) {
    const post = await this.postsRepo.findBySlug(slug, includeComments);

    if (!post) {
      throw new Error("Post no encontrado");
    }

    // Solo incrementar vistas si el post está publicado
    if (post.status === "PUBLISHED") {
      await this.postsRepo.incrementViewCount(post.id);
      return {
        ...post,
        viewCount: post.viewCount + 1,
      };
    }

    return post;
  }

  /**
   * Obtener post por ID (PARA EDICIÓN/ADMIN) - SIN incrementar vistas
   */
  async getPostById(id: string) {
    // Validar autenticación para admin
    const session = await this.validateAuthentication();

    const post = await this.postsRepo.findById(id);

    if (!post) {
      throw new Error("Post no encontrado");
    }

    // Verificar permisos - solo el autor o admin pueden ver
    this.validatePermissions(session.user, post.authorId);

    return post;
  }

  /**
   * Crear nuevo post
   */
  async createPost(data: CreatePostInput) {
    // Validar autenticación
    const session = await this.validateAuthentication();

    // Validar contenido del post
    this.validateContent(data.content);

    // Generar slug único
    const slug = await this.generateUniqueSlug(data.title);

    // Calcular tiempo de lectura
    const readTime = calculateReadTime(data.content);

    // Preparar datos para crear
    const createData = {
      ...data,
      slug,
      readTime,
      authorId: session.user.id,
    };

    return await this.postsRepo.create(createData);
  }

  /**
   * Actualizar post existente
   */
  async updatePost(id: string, data: UpdatePostInput) {
    // Validar autenticación
    const session = await this.validateAuthentication();

    // Verificar que el post existe
    const existingPost = await this.postsRepo.findById(id);
    if (!existingPost) {
      throw new Error("Post no encontrado");
    }

    // Verificar permisos
    this.validatePermissions(session.user, existingPost.authorId);

    // Validar contenido si se proporciona
    if (data.content) {
      this.validateContent(data.content);
    }

    // Preparar datos para actualizar
    const updateData: any = { ...data };

    // Generar nuevo slug si cambió el título
    if (data.title && data.title !== existingPost.title) {
      updateData.slug = await this.generateUniqueSlug(data.title, id);
    }

    // Recalcular tiempo de lectura si cambió el contenido
    if (data.content) {
      updateData.readTime = calculateReadTime(data.content);
    }

    return await this.postsRepo.update(id, updateData);
  }

  /**
   * Eliminar post
   */
  async deletePost(id: string) {
    // Validar autenticación
    const session = await this.validateAuthentication();

    // Verificar que el post existe
    const existingPost = await this.postsRepo.findById(id);
    if (!existingPost) {
      throw new Error("Post no encontrado");
    }

    // Verificar permisos
    this.validatePermissions(session.user, existingPost.authorId);

    return await this.postsRepo.delete(id);
  }

  /**
   * Obtener posts del autor
   */
  async getPostsByAuthor(
    authorId: string,
    params: Partial<PostFiltersInput> = {}
  ) {
    return await this.postsRepo.findByAuthor(authorId, params);
  }

  /**
   * Obtener posts relacionados
   */
  async getRelatedPosts(postId: string, limit: number = 5) {
    const post = await this.postsRepo.findById(postId);
    if (!post) {
      return [];
    }

    const categoryIds = post.categories?.map((pc) => pc.category.id) || [];
    const tagIds = post.tags?.map((pt) => pt.tag.id) || [];

    return await this.postsRepo.findRelatedPosts(
      postId,
      categoryIds,
      tagIds,
      limit
    );
  }

  /**
   * Publicar borrador
   */
  async publishDraft(id: string) {
    const session = await this.validateAuthentication();

    const post = await this.postsRepo.findById(id);
    if (!post) {
      throw new Error("Post no encontrado");
    }

    this.validatePermissions(session.user, post.authorId);

    if (post.status === "PUBLISHED") {
      throw new Error("El post ya está publicado");
    }

    return await this.postsRepo.update(id, {
      status: PostStatus.PUBLISHED,
    });
  }

  /**
   * Convertir a borrador
   */
  async unpublishPost(id: string) {
    const session = await this.validateAuthentication();

    const post = await this.postsRepo.findById(id);
    if (!post) {
      throw new Error("Post no encontrado");
    }

    this.validatePermissions(session.user, post.authorId);

    return await this.postsRepo.update(id, {
      status: PostStatus.DRAFT,
    });
  }

  // === MÉTODOS PRIVADOS ===

  /**
   * Validar que el usuario está autenticado
   */
  private async validateAuthentication() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("Usuario no autenticado");
    }
    return session;
  }

  /**
   * Validar contenido del post
   */
  private validateContent(content: any) {
    if (!validatePostContent(content)) {
      throw new Error("El contenido del post no es válido");
    }
  }

  /**
   * Validar permisos del usuario
   */
  private validatePermissions(user: any, authorId: string) {
    if (user.id !== authorId && user.role !== "ADMIN") {
      throw new Error("No tienes permisos para realizar esta acción");
    }
  }

  /**
   * Generar slug único
   */
  private async generateUniqueSlug(
    title: string,
    excludeId?: string
  ): Promise<string> {
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (await this.postsRepo.slugExists(slug, excludeId)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
