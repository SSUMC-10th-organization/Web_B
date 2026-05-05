export const LpCardSkeleton = () => (
  <div className="aspect-square bg-gray-800 rounded overflow-hidden animate-pulse">
    <div className="w-full h-full bg-gray-700" />
  </div>
);

export const CommentSkeleton = () => (
  <div className="flex gap-4 py-4 animate-pulse">
    <div className="w-10 h-10 bg-gray-700 rounded-full shrink-0" />
    <div className="flex-1 space-y-3">
      <div className="w-24 h-4 bg-gray-700 rounded" />
      <div className="w-full h-4 bg-gray-700 rounded" />
      <div className="w-2/3 h-4 bg-gray-700 rounded" />
    </div>
  </div>
);
