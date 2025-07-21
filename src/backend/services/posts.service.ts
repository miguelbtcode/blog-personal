import { PostsRepository } from "../repositories/posts.repository";
import { generateSlug, calculateReadTime } from "@/lib/utils";
import {
  CreatePostInput,
  UpdatePostInput,
  PostFiltersInput,
} from "@/shared/schemas";
import { CacheManager } from "@/lib/cache-manager";

export class PostsService {
  private postsRepo = new PostsRepository();

  /**
   * Obtener posts con cache inteligente
   */
  async getPosts(params: PostFiltersInput) {
    // Crear clave de cache basada en los parámetros
    const cacheKey = this.generateCacheKey("list", params);

    // Intentar obtener desde cache
    let result = CacheManager.get("postLists", cacheKey);
    if (result) {
      return result;
    }

    // Si no está en cache, obtener desde DB
    result = await this.postsRepo.findMany(params);

    // Cachear solo si la lista no es muy grande para optimizar memoria
    if (result.items.length <= 20) {
      CacheManager.set("postLists", cacheKey, result);
    }

    return result;
  }

  /**
   * Obtener post por slug con cache
   */
  async getPostBySlug(slug: string, includeComments: boolean = false) {
    const cacheKey = `slug:${slug}${includeComments ? ":comments" : ""}`;

    // Verificar cache primero
    let post = CacheManager.get("posts", cacheKey);
    if (post) {
      // Incrementar view count de forma asíncrona sin afectar la respuesta
      this.incrementViewCountAsync(post.id);
      return {
        ...post,
        viewCount: post.viewCount + 1,
      };
    }

    // Obtener desde DB
    post = await this.postsRepo.findBySlug(slug, includeComments);
    if (!post) {
      throw new Error("Post no encontrado");
    }

    // Cachear el post
    CacheManager.set("posts", cacheKey, post);

    // Incrementar view count
    await this.postsRepo.incrementViewCount(post.id);

    return {
      ...post,
      viewCount: post.viewCount + 1,
    };
  }

  /**
   * Obtener post por ID con cache
   */
  async getPostById(id: string) {
    const cacheKey = `id:${id}`;

    let post = CacheManager.get("posts", cacheKey);
    if (post) {
      return post;
    }

    post = await this.postsRepo.findById(id);
    if (post) {
      CacheManager.set("posts", cacheKey, post);
    }

    return post;
  }

  /**
   * Crear post con invalidación de cache
   */
  async createPost(data: CreatePostInput & { authorId: string }) {
    const slug = await this.generateUniqueSlug(data.title);
    const readTime = calculateReadTime(data.content);

    const postData = {
      ...data,
      slug,
      readTime,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    };

    const newPost = await this.postsRepo.create(postData);

    // Invalidar caches relacionados
    this.invalidatePostCaches();

    // Cachear el nuevo post
    CacheManager.set("posts", `slug:${newPost.slug}`, newPost);
    CacheManager.set("posts", `id:${newPost.id}`, newPost);

    return newPost;
  }

  /**
   * Actualizar post con gestión inteligente de cache
   */
  async updatePost(id: string, data: Partial<UpdatePostInput>) {
    const existingPost = await this.getPostById(id);
    if (!existingPost) {
      throw new Error("Post no encontrado");
    }

    // Determinar si necesita nuevo slug
    let newSlug = existingPost.slug;
    if (data.title && data.title !== existingPost.title) {
      newSlug = await this.generateUniqueSlug(data.title);
    }

    // Recalcular readTime si el contenido cambió
    let readTime = existingPost.readTime;
    if (data.content && data.content !== existingPost.content) {
      readTime = calculateReadTime(data.content);
    }

    const updateData = {
      ...data,
      slug: newSlug,
      readTime,
      publishedAt:
        data.status === "PUBLISHED" && existingPost.status !== "PUBLISHED"
          ? new Date()
          : existingPost.publishedAt,
    };

    const updatedPost = await this.postsRepo.update(id, updateData);

    // Invalidación inteligente de cache
    this.invalidatePostCaches(existingPost.slug);

    // Si el slug cambió, invalidar ambos
    if (newSlug !== existingPost.slug) {
      this.invalidatePostCaches(newSlug);
    }

    // Cachear el post actualizado
    CacheManager.set("posts", `slug:${updatedPost.slug}`, updatedPost);
    CacheManager.set("posts", `id:${updatedPost.id}`, updatedPost);

    return updatedPost;
  }

  /**
   * Eliminar post con limpieza de cache
   */
  async deletePost(id: string) {
    const existingPost = await this.getPostById(id);
    if (!existingPost) {
      throw new Error("Post no encontrado");
    }

    await this.postsRepo.delete(id);

    // Limpiar todos los caches relacionados
    this.invalidatePostCaches(existingPost.slug);

    return true;
  }

  /**
   * Obtener posts relacionados con cache
   */
  async getRelatedPosts(
    postId: string,
    categoryIds: string[] = [],
    tagIds: string[] = [],
    limit: number = 5
  ) {
    const cacheKey = `related:${postId}:${categoryIds.sort().join(",")}:${tagIds
      .sort()
      .join(",")}:${limit}`;

    let relatedPosts = CacheManager.get("posts", cacheKey);
    if (relatedPosts) {
      return relatedPosts;
    }

    relatedPosts = await this.postsRepo.findRelatedPosts(
      postId,
      categoryIds,
      tagIds,
      limit
    );

    // Cachear con TTL más corto para posts relacionados
    CacheManager.set("shortTerm", cacheKey, relatedPosts);

    return relatedPosts;
  }

  /**
   * Búsqueda de posts por autor con cache
   */
  async getPostsByAuthor(
    authorId: string,
    params: Partial<PostFiltersInput> = {}
  ) {
    const cacheKey = this.generateCacheKey("author", { ...params, authorId });

    let result = CacheManager.get("postLists", cacheKey);
    if (result) {
      return result;
    }

    result = await this.postsRepo.findByAuthor(authorId, params);

    if (result.items.length <= 20) {
      CacheManager.set("postLists", cacheKey, result);
    }

    return result;
  }

  /**
   * Verificar si existe un slug (con cache de metadata)
   */
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const cacheKey = `slug-exists:${slug}${
      excludeId ? `:exclude:${excludeId}` : ""
    }`;

    let exists = CacheManager.get("metadata", cacheKey);
    if (exists !== undefined) {
      return exists;
    }

    exists = await this.postsRepo.slugExists(slug, excludeId);

    // Cachear por poco tiempo ya que puede cambiar
    CacheManager.set("metadata", cacheKey, exists);

    return exists;
  }

  // Métodos privados de utilidad

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (await this.slugExists(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  private generateCacheKey(prefix: string, params: any): string {
    // Ordenar parámetros para generar claves consistentes
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        if (
          params[key] !== undefined &&
          params[key] !== null &&
          params[key] !== ""
        ) {
          result[key] = params[key];
        }
        return result;
      }, {} as any);

    return `${prefix}:${JSON.stringify(sortedParams)}`;
  }

  private invalidatePostCaches(slug?: string): void {
    // Invalidar listas de posts
    CacheManager.invalidatePattern("postLists", "list:");
    CacheManager.invalidatePattern("postLists", "author:");

    // Invalidar posts relacionados
    CacheManager.clear("shortTerm");

    // Invalidar metadata
    CacheManager.invalidatePattern("metadata", "slug-exists:");

    // Si hay un slug específico, invalidar sus caches
    if (slug) {
      CacheManager.invalidatePattern("posts", `slug:${slug}`);
      CacheManager.invalidatePattern("posts", `related:`);
    }
  }

  private async incrementViewCountAsync(postId: string): Promise<void> {
    // Incrementar view count en background sin bloquear la respuesta
    try {
      await this.postsRepo.incrementViewCount(postId);
      // Invalidar cache del post para que la próxima lectura tenga el contador actualizado
      CacheManager.invalidatePattern("posts", `id:${postId}`);
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  }

  // Métodos de debugging y monitoreo

  getCacheStats() {
    return CacheManager.getStats();
  }

  clearAllCaches() {
    CacheManager.clear();
  }

  warmUpCache() {
    // Pre-cargar posts más populares o recientes
    // Implementar según necesidades específicas
  }
}
