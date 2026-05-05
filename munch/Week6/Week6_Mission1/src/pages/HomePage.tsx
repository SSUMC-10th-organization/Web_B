import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetLpListInfinite from "../hooks/queries/useGetLpListInfinite";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import type { PAGINATION_ORDER } from "../enums/common";
import { ErrorFallback } from "../components/CommonStates";
import { LpCardSkeleton } from "../components/Skeletons";
import { formatTimeAgo } from "../utils/date";
import type { Lp } from "../types/lp";

const HomePage = () => {
  const { accessToken } = useAuth();
  const [order, setOrder] = useState<PAGINATION_ORDER>("desc");

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpListInfinite(order);

  const loadMoreRef = useIntersectionObserver(fetchNextPage, hasNextPage);

  const lps: Lp[] = data?.pages.flatMap((page) => page.data.data) ?? [];

  if (!accessToken) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500 text-lg pt-20">
        로그인 후 다양한 LP를 탐색해보세요. 🎵
      </div>
    );
  }

  if (isError) return <ErrorFallback onRetry={refetch} />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-end mb-4 gap-2">
        <button
          type="button"
          onClick={() => setOrder("asc")}
          className={`px-4 py-1.5 text-sm rounded border transition-colors ${
            order === "asc"
              ? "bg-white text-black border-white font-semibold"
              : "border-gray-600 text-gray-300 hover:border-gray-400"
          }`}
        >
          오래된순
        </button>
        <button
          type="button"
          onClick={() => setOrder("desc")}
          className={`px-4 py-1.5 text-sm rounded border transition-colors ${
            order === "desc"
              ? "bg-white text-black border-white font-semibold"
              : "border-gray-600 text-gray-300 hover:border-gray-400"
          }`}
        >
          최신순
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isPending &&
          Array.from({ length: 10 }).map((_, i) => (
            <LpCardSkeleton key={`skeleton-${i}`} />
          ))}

        {!isPending &&
          lps.map((lp: Lp) => (
            <Link
              key={lp.id}
              to={`/lp/${lp.id}`}
              className="group relative aspect-square overflow-hidden rounded bg-gray-800 block"
            >
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <h3 className="text-white font-bold text-sm truncate">
                  {lp.title}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-300 text-xs">
                    {formatTimeAgo(lp.createdAt)}
                  </span>
                  <span className="text-[#e91e8c] text-xs font-semibold">
                    ♥ {lp.likes?.length || 0}
                  </span>
                </div>
              </div>
            </Link>
          ))}

        {isFetchingNextPage &&
          Array.from({ length: 5 }).map((_, i) => (
            <LpCardSkeleton key={`more-skeleton-${i}`} />
          ))}
      </div>

      <div ref={loadMoreRef} className="h-10 w-full mt-4" />
    </div>
  );
};

export default HomePage;
