import Link from "next/link";

interface BlogsPaginationProps {
  currentPage: number;
  category?: string | undefined;
  tag?: string | undefined;
  search?: string | undefined;
}

export function BlogsPagination({
  currentPage,
  category,
  tag,
  search,
}: BlogsPaginationProps) {
  const totalPages = 5; // Mock data - get from API
  const pages = [1, 2, 3, 4, 5];

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    if (search) params.set("search", search);

    const queryString = params.toString();
    return `/blogs${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      {/* Previous Arrow */}
      <Link
        href={buildUrl(Math.max(1, currentPage - 1))}
        className={`p-2 rounded-lg ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Link>

      {/* Page Numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          href={buildUrl(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Next Arrow */}
      <Link
        href={buildUrl(Math.min(totalPages, currentPage + 1))}
        className={`p-2 rounded-lg ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  );
}
