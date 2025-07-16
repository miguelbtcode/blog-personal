export function BlogsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="aspect-video bg-gray-200"></div>

          {/* Content skeleton */}
          <div className="p-6">
            <div className="flex justify-between mb-3">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>

            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>

            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
