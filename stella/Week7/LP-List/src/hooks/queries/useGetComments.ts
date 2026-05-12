import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentList } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationDto } from "../../types/common";

function useGetComments(
  lpId: number,
  { order, limit }: Omit<PaginationDto, "cursor">,
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lpComments, lpId, order],
    queryFn: ({ pageParam: cursor }) =>
      getCommentList(lpId, { cursor, order, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    select: (data) => ({
      pages: data.pages.flatMap((page) => page.data.data),
      pageParams: data.pageParams,
    }),
    enabled: !!lpId,
  });
}

export default useGetComments;
