"use client";

import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Settings,
  Plus,
  TrendingUp,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminDashboard() {
  const [stats] = useState({
    totalPosts: 24,
    totalUsers: 156,
    totalComments: 89,
    views: 12453,
  });

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border h-[calc(100vh-73px)]">
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/dashboard"
                className="flex items-center space-x-3 px-4 py-3 text-primary-foreground bg-primary rounded-lg"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/posts"
                className="flex items-center space-x-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span>Posts</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="flex items-center space-x-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <Users className="h-5 w-5" />
                <span>Usuarios</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/comments"
                className="flex items-center space-x-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Comentarios</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="flex items-center space-x-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Configuración</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-background">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Posts</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalPosts}
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Usuarios</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalUsers}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Comentarios</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalComments}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Visualizaciones</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.views.toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <Link
                href="/admin/posts/create"
                className="flex items-center space-x-3 p-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5 text-primary" />
                <span className="text-foreground">Crear Nuevo Post</span>
              </Link>
              <Link
                href="/admin/users/new"
                className="flex items-center space-x-3 p-3 bg-muted hover:bg-accent rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">Agregar Usuario</span>
              </Link>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Actividad Reciente
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-foreground text-sm">
                    Nuevo comentario en Mi primer post
                  </p>
                  <p className="text-muted-foreground text-xs">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-foreground text-sm">
                    Nuevo usuario registrado
                  </p>
                  <p className="text-muted-foreground text-xs">Hace 4 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <FileText className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-foreground text-sm">
                    Post React vs Vue publicado
                  </p>
                  <p className="text-muted-foreground text-xs">Hace 1 día</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Posts Recientes
            </h3>
            <Link
              href="/admin/posts"
              className="text-primary hover:text-primary/80 text-sm"
            >
              Ver todos
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-muted-foreground pb-2">
                    Título
                  </th>
                  <th className="text-left text-muted-foreground pb-2">
                    Estado
                  </th>
                  <th className="text-left text-muted-foreground pb-2">
                    Fecha
                  </th>
                  <th className="text-left text-muted-foreground pb-2">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 text-foreground">
                    Mi primer post con Next.js
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded">
                      Publicado
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">15/07/2024</td>
                  <td className="py-3">
                    <Link
                      href="/admin/posts/1/edit"
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 text-foreground">
                    Guía completa de React
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs rounded">
                      Borrador
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">14/07/2024</td>
                  <td className="py-3">
                    <Link
                      href="/admin/posts/2/edit"
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
