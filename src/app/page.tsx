import { HomeFeature } from "@/features/home";

// Función para obtener posts del servidor (opcional para SSG)
async function getPosts() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/posts?limit=6&status=PUBLISHED`,
      {
        cache: "force-cache", // Para SSG
        next: { revalidate: 3600 }, // Revalidar cada hora
      }
    );

    if (!res.ok) {
      throw new Error("Error fetching posts");
    }

    return res.json();
  } catch (error) {
    console.error("Error:", error);
    return { posts: [] };
  }
}

export default async function HomePage() {
  // Obtener posts en el servidor para SSG/SSR
  const { posts } = await getPosts();

  return <HomeFeature initialPosts={posts} />;
}
