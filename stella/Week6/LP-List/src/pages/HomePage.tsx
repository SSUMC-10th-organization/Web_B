import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import type { PAGINATION_ORDER } from "../types/common";
import { useState } from "react";

export const HomePage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<PAGINATION_ORDER>("desc");
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLpList({ order });

  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  // IntersectionObserver로 무한스크롤
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 300px 0px" }, // 바닥 300px 전에 미리 트리거
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        Error...
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* 정렬 버튼 */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setOrder("asc")}
          className={`px-4 py-1.5 rounded text-sm font-medium border transition-colors ${
            order === "asc"
              ? "bg-white text-black border-white"
              : "bg-transparent text-white border-white/40 hover:border-white"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder("desc")}
          className={`px-4 py-1.5 rounded text-sm font-medium border transition-colors ${
            order === "desc"
              ? "bg-white text-black border-white"
              : "bg-transparent text-white border-white/40 hover:border-white"
          }`}
        >
          최신순
        </button>
      </div>

      {/* LP 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
        {lps.map((lp) => (
          <div
            key={lp.id}
            className="relative aspect-square cursor-pointer overflow-hidden group"
            onClick={() => navigate(`/lps/${lp.id}`)}
          >
            {/* 썸네일 */}
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* 호버 오버레이 */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <p className="text-white text-sm font-semibold truncate">
                {lp.title}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-pink-400 text-xs">
                  ♥ {lp.likes.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 무한스크롤 트리거 */}
      <div ref={observerRef} className="h-10 mt-4" />

      {/* 로딩 인디케이터 */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-6 text-white text-sm">
          Loading more...
        </div>
      )}
    </div>
  );
};
export default HomePage;
