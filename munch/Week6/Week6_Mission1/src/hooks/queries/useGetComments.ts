import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentList } from "../../apis/comment";
import type { PAGINATION_ORDER } from "../../enums/common";

function useGetComments(lpId: number, order: PAGINATION_ORDER) {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam }) =>
      getCommentList(lpId, {
        cursor: pageParam,
        limit: 10,
        order,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    enabled: !!lpId,
    staleTime: 1000 * 60 * 5,
  });
}

export default useGetComments;
