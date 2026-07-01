export default function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200" />

        <div className="flex-1">
          <div className="h-4 w-36 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </div>
      </div>

      <div className="w-full h-72 rounded-xl bg-gray-200" />

      <div className="mt-4 space-y-3">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />

        <div className="flex gap-5 mt-4">
          <div className="h-8 w-16 bg-gray-200 rounded-full" />
          <div className="h-8 w-20 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}