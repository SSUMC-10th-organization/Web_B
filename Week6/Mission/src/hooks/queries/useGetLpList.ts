import { useInfiniteQuery } from "@tanstack/react-query";
import { type PaginationDto } from "../../apis/common";
import { QUERY_KEY } from "../../constants/key";
import { getLPList } from "../../apis/lp";

export function useGetLpList({cursor,search,order,limit}:PaginationDto){
    return useInfiniteQuery<any, Error, any, any[], number | undefined>({
        queryKey:[QUERY_KEY.lps,{ search, order, limit }],
        queryFn: ({ pageParam }) => getLPList({
            cursor: pageParam, //자동 관리되는 커서 주입
            search,
            order,
            limit,
        }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },
        staleTime:1000*60*5, // 5분
        gcTime:1000*60*10, // 10분
    });
}