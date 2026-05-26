import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList, getLpListByTag } from "../../apis/lp";
import type { ResponseLpListDto } from "../../types/lp";

type SearchType = "title" | "tag";

function useSearchLpList(query: string, searchType: SearchType) {
	return useInfiniteQuery({
		queryKey: ["search", query, searchType],
		queryFn: ({ pageParam }: { pageParam: number }) => {
			if (searchType === "tag") {
				return getLpListByTag(query, {
					cursor: pageParam,
					limit: 10,
					order: "desc",
				});
			}
			return getLpList({
				cursor: pageParam,
				limit: 10,
				order: "desc",
				search: query,
			});
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage: ResponseLpListDto) =>
			lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
		// 빈 검색어일 때 쿼리 실행 안 함
		enabled: !!query.trim(),
		staleTime: 1000 * 60 * 3,
		gcTime: 1000 * 60 * 5,
	});
}

export default useSearchLpList;
