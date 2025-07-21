// app/(admin)/admin/posts/page.tsx - Corregido
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
} from "lucide-react";
import { useToast } from "@/frontend/components/ui/Toast";
import { PostStatus } from "@/shared/enums";
import { PostFilters } from "@/types";
import { useDeletePost, usePosts } from "@/frontend/hooks/api/usePosts";

export default function AdminPostsPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Estados para filtros
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  // Construir filtros
  const filters: PostFilters = {
    search: search || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    page,
    limit: 10,
    isAdmin: true,
  };

  // Hooks de React Query
  const { data, isLoading, refetch } = usePosts(filters);
  const deletePostMutation = useDeletePost();

  // Extraer datos de la respuesta
  const posts = data?.items || [];
  const pagination = data?.pagination;

  // Manejar eliminación
  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar "${title}"?`
    );

    if (confirmDelete) {
      try {
        await deletePostMutation.mutateAsync(id);
        toast({
          title: "Post eliminado",
          description: `"${title}" se eliminó correctamente`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el post",
          variant: "destructive",
        });
      }
    }
  };

  // Formatear fecha
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Posts</h1>
              <p className="text-muted-foreground mt-1">
                Gestiona todo tu contenido
              </p>
            </div>

            <button
              onClick={() => router.push("/admin/posts/create")}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Post</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filtros */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Filtro de estado */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as PostStatus | "ALL")
                }
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="ALL">Todos</option>
                <option value={PostStatus.PUBLISHED}>Publicados</option>
                <option value={PostStatus.DRAFT}>Borradores</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de posts */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Cargando posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No se encontraron posts</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-foreground">
                      Título
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground">
                      Estado
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground">
                      Autor
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground">
                      Fecha
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground">
                      Vistas
                    </th>
                    <th className="text-right p-4 font-semibold text-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-t border-border hover:bg-muted/20 transition-colors"
                    >
                      {/* Título */}
                      <td className="p-4">
                        <div className="flex items-start space-x-3">
                          {post.featuredImage && (
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-foreground truncate">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === PostStatus.PUBLISHED
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.status === PostStatus.PUBLISHED
                            ? "📝 Publicado"
                            : "🏗️ Borrador"}
                        </span>
                      </td>

                      {/* Autor */}
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {post.author?.image && (
                            <img
                              src={post.author.image}
                              alt={post.author.name}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span className="text-sm text-foreground">
                            {post.author?.name}
                          </span>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td className="p-4">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(
                              post.publishedAt?.toString() ||
                                post.createdAt?.toString() ||
                                ""
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Vistas */}
                      <td className="p-4">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          <span>{post.viewCount || 0}</span>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="p-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              router.push(`/admin/posts/${post.id}/edit`)
                            }
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </button>

                          <button
                            onClick={() =>
                              router.push(`/admin/posts/${post.id}/view`)
                            }
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Ver"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>

                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            disabled={deletePostMutation.isPending}
                            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Paginación */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Mostrando {posts.length} de {pagination.total} posts
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <span className="px-3 py-1 bg-primary text-primary-foreground rounded">
                {page}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
