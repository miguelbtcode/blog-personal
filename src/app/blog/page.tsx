import Link from "next/link";

async function getPosts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/posts`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("Error fetching posts");
    return res.json();
  } catch (error) {
    console.error("Error:", error);
    return { posts: [], pagination: { total: 0 } };
  }
}

export default async function BlogPage() {
  const { posts, pagination } = await getPosts();

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Mi Blog
          </Link>
          <div className="space-x-4">
            <Link href="/blog" className="text-blue-600 font-medium">
              Blog
            </Link>
            <Link
              href="/admin"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Admin
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Artículos del Blog</h1>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No hay artículos publicados aún.
            </p>
            <Link
              href="/admin"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded"
            >
              Crear primer artículo
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post: any) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <h2 className="text-xl font-semibold mb-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600"
                  >
                    {post.title}
                  </Link>
                </h2>

                {post.excerpt && (
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                )}

                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>Por {post.author.name}</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("es-ES")}
                  </span>
                  <span>{post.viewCount} vistas</span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  Leer más →
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
