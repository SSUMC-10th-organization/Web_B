import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ErrorFallback } from "../components/CommonStates";
import { LpCardSkeleton } from "../components/Skeletons";
import useSearchLpList from "../hooks/queries/useSearchLpList";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import type { Lp } from "../types/lp";
import { formatTimeAgo } from "../utils/date";

type SearchType = "title" | "tag";

const skeletonKeys = Array.from({ length: 10 }, (_, i) => `search-sk-${i}`);
const moreSkeletonKeys = Array.from(
  { length: 5 },
  (_, i) => `search-more-sk-${i}`,
);

const SearchPage = () => {
  // URL 파라미터에서 검색어와 타입 읽기
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const searchType = (searchParams.get("type") ?? "title") as SearchType;

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchLpList(query, searchType);

  const loadMoreRef = useIntersectionObserver(fetchNextPage, hasNextPage);

  const results: Lp[] = data?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* 검색어 표시 */}
      <div className="mb-6">
        <h2 className="text-white font-bold text-lg">
          {searchType === "tag" ? "# " : ""}
          {query}
          <span className="text-gray-400 font-normal text-sm ml-2">
            검색 결과
          </span>
        </h2>
      </div>

      {/* 로딩 */}
      {isPending && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {skeletonKeys.map((key) => (
            <LpCardSkeleton key={key} />
          ))}
        </div>
      )}

      {isError && <ErrorFallback onRetry={refetch} />}

      {/* 결과 없음 */}
      {!isPending && !isError && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg mb-1">검색 결과가 없습니다.</p>
          <p className="text-sm">다른 검색어를 입력해보세요.</p>
        </div>
      )}

      {/* 결과 그리드 */}
      {!isPending && !isError && results.length > 0 && (
        <>
          <p className="text-xs text-gray-500 mb-4">총 {results.length}개</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((lp: Lp) => (
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
              moreSkeletonKeys.map((key) => <LpCardSkeleton key={key} />)}
          </div>

          <div ref={loadMoreRef} className="h-10 w-full mt-4" />
        </>
      )}
    </div>
  );
};

export default SearchPage;
