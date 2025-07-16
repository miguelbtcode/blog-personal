import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={cn("bg-black w-full", className)}>
      <nav className="max-w-8xl mx-auto px-6 py-6 flex justify-between items-center">
        {/* Logo a la izquierda */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">MB</span>
          </div>
          <span className="text-2xl font-bold text-white">miguelbtcode</span>
        </Link>

        {/* Menú y suscribirse a la derecha */}
        <div className="flex items-center space-x-10">
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors text-xl font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/blog"
              className="text-gray-300 hover:text-white transition-colors text-xl font-medium"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-white transition-colors text-xl font-medium"
            >
              Acerca de
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-white transition-colors text-xl font-medium"
            >
              Contacto
            </Link>
          </div>

          <button className="bg-primary text-white px-6 py-3 rounded-lg text-xl font-normal hover:bg-primary/70 transition-colors">
            Suscribirse
          </button>
        </div>
      </nav>
    </header>
  );
}
