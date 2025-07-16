"use client";

import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats] = useState({
    totalPosts: 24,
    totalUsers: 156,
    totalComments: 89,
    views: 12453,
  });

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin" });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Hola, {session?.user?.name || session?.user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 h-[calc(100vh-73px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center space-x-3 px-4 py-3 text-white bg-primary/20 border border-primary/30 rounded-lg"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/posts"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FileText className="h-5 w-5" />
                  <span>Posts</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/users"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Usuarios</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/comments"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Comentarios</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/settings"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  <span>Configuración</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Posts</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalPosts}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Usuarios</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalUsers}
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Comentarios</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalComments}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Visualizaciones</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.views.toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Acciones Rápidas
              </h3>
              <div className="space-y-3">
                <Link
                  href="/admin/posts/new"
                  className="flex items-center space-x-3 p-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5 text-primary" />
                  <span className="text-white">Crear Nuevo Post</span>
                </Link>
                <Link
                  href="/admin/users/new"
                  className="flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5 text-gray-400" />
                  <span className="text-white">Agregar Usuario</span>
                </Link>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Actividad Reciente
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white text-sm">
                      Nuevo comentario en Mi primer post
                    </p>
                    <p className="text-gray-400 text-xs">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <Users className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white text-sm">
                      Nuevo usuario registrado
                    </p>
                    <p className="text-gray-400 text-xs">Hace 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-white text-sm">
                      Post React vs Vue publicado
                    </p>
                    <p className="text-gray-400 text-xs">Hace 1 día</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
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
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 pb-2">Título</th>
                    <th className="text-left text-gray-400 pb-2">Estado</th>
                    <th className="text-left text-gray-400 pb-2">Fecha</th>
                    <th className="text-left text-gray-400 pb-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 text-white">
                      Mi primer post con Next.js
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                        Publicado
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">15/07/2024</td>
                    <td className="py-3">
                      <Link
                        href="/admin/posts/1/edit"
                        className="text-primary hover:text-primary/80 text-sm"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 text-white">Guía completa de React</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                        Borrador
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">14/07/2024</td>
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
    </div>
  );
}
