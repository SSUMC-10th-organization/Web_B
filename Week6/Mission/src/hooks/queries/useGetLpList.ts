import { useQuery } from "@tanstack/react-query";
import { type PaginationDto } from "../../apis/common";
import { QUERY_KEY } from "../../constants/key";
import { getLPList } from "../../apis/lp";

export function useGetLpList({cursor,search,order,limit}:PaginationDto){
    return useQuery({
        queryKey:[QUERY_KEY.lps,{ cursor, search, order, limit }],
        queryFn:() => getLPList({
            cursor,
            search,
            order,
            limit,
        }),
        staleTime:1000*60*5, // 5분
        gcTime:1000*60*10, // 10분
    });
}