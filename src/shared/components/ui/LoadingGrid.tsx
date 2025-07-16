export function LoadingGrid({ columns = 3 }: { columns?: number }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-8`}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          <div className="aspect-video bg-gray-200" />
          <div className="p-6">
            <div className="flex gap-2 mb-3">
              <div className="h-5 bg-gray-200 rounded-full w-16" />
            </div>
            <div className="h-6 bg-gray-200 rounded mb-3" />
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
