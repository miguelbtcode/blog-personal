"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  author: { name: string };
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts?status=DRAFT")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Mi Blog
          </Link>
          <div className="space-x-4">
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">
              Blog
            </Link>
            <Link
              href="/admin/new"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Nuevo Post
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Panel de Administración</h1>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Posts</h2>
          </div>

          {loading ? (
            <div className="p-6">Cargando...</div>
          ) : posts.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No hay posts aún.</p>
              <Link
                href="/admin/new"
                className="mt-2 inline-block text-blue-600 hover:underline"
              >
                Crear el primero
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-6 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm text-gray-600">
                      {post.status} •{" "}
                      {new Date(post.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <Link
                    href={`/admin/edit/${post.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
