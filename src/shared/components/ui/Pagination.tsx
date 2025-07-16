import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  baseUrl?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  baseUrl = "",
}: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    // Always show last page
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex justify-center items-center space-x-2"
      aria-label="Pagination"
    >
      {/* Previous button */}
      {hasPrev ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="flex items-center px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Link>
      ) : (
        <span className="flex items-center px-3 py-2 text-sm text-gray-300 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </span>
      )}

      {/* Page numbers */}
      <div className="flex space-x-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm text-gray-500"
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return isActive ? (
            <span
              key={pageNumber}
              className="px-3 py-2 text-sm bg-blue-600 text-white border border-blue-600 rounded-md"
              aria-current="page"
            >
              {pageNumber}
            </span>
          ) : (
            <Link
              key={pageNumber}
              href={createPageUrl(pageNumber)}
              className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>

      {/* Next button */}
      {hasNext ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="flex items-center px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Siguiente
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      ) : (
        <span className="flex items-center px-3 py-2 text-sm text-gray-300 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed">
          Siguiente
          <ChevronRight className="w-4 h-4 ml-1" />
        </span>
      )}
    </nav>
  );
}
