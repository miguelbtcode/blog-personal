import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Mi Blog</h1>
          <div className="space-x-4">
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">
              Blog
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              Admin
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Bienvenido a mi blog</h2>
          <p className="text-xl text-gray-600 mb-8">
            Comparto pensamientos, ideas y experiencias
          </p>
          <Link
            href="/blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
          >
            Ver artículos
          </Link>
        </div>
      </main>
    </div>
  );
}
