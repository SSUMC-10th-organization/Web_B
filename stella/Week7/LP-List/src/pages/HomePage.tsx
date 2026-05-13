import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";

const LpCardSkeleton = () => (
  <div className="flex flex-col gap-2">
    <div className="w-full aspect-square bg-gray-200 animate-pulse rounded-md" />
    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
    <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
  </div>
);

export const HomePage = () => {
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetLpList({ order });

  const toggleOrder = () => {
    setOrder((prev) =>
      prev === PAGINATION_ORDER.desc
        ? PAGINATION_ORDER.asc
        : PAGINATION_ORDER.desc,
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="p-6 w-full">
        <div className="flex justify-end mb-4">
          <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <LpCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4">
        <p className="text-gray-500">데이터를 불러오는데 실패했습니다.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-[#333] transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 w-full self-start">
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleOrder}
          className="px-4 py-1.5 text-sm border border-[#444] rounded-md hover:bg-gray-100 transition-colors"
        >
          {order === PAGINATION_ORDER.desc ? "최신순" : "오래된순"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data?.pages.map((lp) => (
          <div
            key={lp.id}
            onClick={() => navigate(`/lp/${lp.id}`)}
            className="relative flex flex-col gap-2 cursor-pointer group"
          >
            <div className="relative w-full aspect-square bg-gray-100 rounded-md overflow-hidden">
              {lp.thumbnail ? (
                <img
                  src={lp.thumbnail}
                  alt={lp.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-1">
                <p className="text-white text-sm font-semibold truncate">
                  {lp.title}
                </p>
                <p className="text-gray-300 text-xs">
                  {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
                </p>
                <div className="flex items-center gap-1 text-gray-300 text-xs">
                  <span>♥</span>
                  <span>{lp.likes.length}</span>
                </div>
              </div>
            </div>
            <p className="text-sm font-medium truncate">{lp.title}</p>
            <p className="text-xs text-gray-400">
              {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
            </p>
          </div>
        ))}

        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => (
            <LpCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      <div ref={bottomRef} className="h-10" />
    </div>
  );
};

export default HomePage;
