import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ search, order, limit }: Omit<PaginationDto, "cursor">) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: ({ pageParam: cursor }) =>
      getLpList({ cursor, search, order, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined, // data 안에 있음
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    select: (data) => ({
      pages: data.pages.flatMap((page) => page.data.data), // data.data 안에 배열
      pageParams: data.pageParams,
    }),
  });
}

export default useGetLpList;
