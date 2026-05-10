import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { PAGINATION_ORDER } from "../../enums/common";
import type { ResponseLpListDto } from "../../types/lp";

function useGetLpListInfinite(order: PAGINATION_ORDER) {
	return useInfiniteQuery({
		queryKey: [QUERY_KEY.lps, order],
		queryFn: ({ pageParam }: { pageParam: number }) =>
			getLpList({
				cursor: pageParam,
				limit: 10,
				order,
			}),
		initialPageParam: 0,
		getNextPageParam: (lastPage: ResponseLpListDto) =>
			lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
		staleTime: 1000 * 60 * 5,
	});
}

export default useGetLpListInfinite;
