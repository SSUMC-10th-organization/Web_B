import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyLpList } from "../../apis/lp";
import type { PAGINATION_ORDER } from "../../enums/common";
import type { ResponseLpListDto } from "../../types/lp";

function useGetMyLpList(order: PAGINATION_ORDER) {
	return useInfiniteQuery({
		queryKey: ["myLps", order],
		queryFn: ({ pageParam }: { pageParam: number }) =>
			getMyLpList({ cursor: pageParam, limit: 10, order }),
		initialPageParam: 0,
		getNextPageParam: (lastPage: ResponseLpListDto) =>
			lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
		staleTime: 1000 * 60 * 5,
	});
}

export default useGetMyLpList;
