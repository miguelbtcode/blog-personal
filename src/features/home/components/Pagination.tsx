import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  total,
  basePath = "",
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Mostrar solo un rango de páginas
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;

    if (currentPage <= 4) {
      return [...pages.slice(0, 5), "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, "...", ...pages.slice(totalPages - 5)];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Información de resultados */}
      <p className="text-sm text-gray-600">
        Mostrando página {currentPage} de {totalPages} ({total} artículos en
        total)
      </p>

      {/* Controles de paginación */}
      <nav className="flex items-center space-x-2">
        {/* Botón anterior */}
        <Link
          href={currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : "#"}
          className={cn(
            "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            currentPage > 1
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          )}
          aria-disabled={currentPage <= 1}
        >
          ← Anterior
        </Link>

        {/* Números de página */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-gray-400"
                >
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <Link
                key={pageNumber}
                href={`${basePath}?page=${pageNumber}`}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>

        {/* Botón siguiente */}
        <Link
          href={
            currentPage < totalPages
              ? `${basePath}?page=${currentPage + 1}`
              : "#"
          }
          className={cn(
            "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            currentPage < totalPages
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          )}
          aria-disabled={currentPage >= totalPages}
        >
          Siguiente →
        </Link>
      </nav>
    </div>
  );
}
