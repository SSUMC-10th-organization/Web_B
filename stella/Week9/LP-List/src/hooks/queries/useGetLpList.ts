import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ search, order, limit }: Omit<PaginationDto, "cursor">) {
  const isSearchEmpty = search !== undefined && (search === "" || search.trim() === "");

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: ({ pageParam: cursor }) =>
      getLpList({ cursor, search, order, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !isSearchEmpty,
    select: (data) => ({
      pages: data.pages.flatMap((page) => page.data.data),
      pageParams: data.pageParams,
    }),
  });
}

export default useGetLpList;
