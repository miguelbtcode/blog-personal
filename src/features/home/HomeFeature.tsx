// src/features/home/HomeFeature.tsx
"use client";

import { useState, useEffect } from "react";
import HeroBanner from "./components/HeroBanner";
import LatestPosts from "./components/LatestPosts";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  createdAt: string;
  viewCount: number;
  author: {
    name: string;
  };
  categories?: {
    name: string;
    slug: string;
  }[];
}

interface HomeFeatureProps {
  initialPosts?: Post[];
  showHero?: boolean;
  postsLimit?: number;
}

export default function HomeFeature({
  initialPosts = [],
  showHero = true,
  postsLimit = 6,
}: HomeFeatureProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(!initialPosts.length);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialPosts.length) {
      fetchPosts();
    }
  }, [initialPosts.length]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/posts?limit=${postsLimit}&status=PUBLISHED`
      );

      if (!response.ok) {
        throw new Error("Error al cargar los posts");
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPosts}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {showHero && <HeroBanner />}
      <LatestPosts posts={posts} />
    </main>
  );
}
