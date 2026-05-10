import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/lp";

export function useGetLpComments(lpid: string, order : string) {
    
    return useInfiniteQuery<any, Error, any, string[], number | undefined>({
        // 💡 게시글 ID별로 댓글 캐시를 관리하도록 설정
        queryKey: ["lpComments", lpid, order],
        queryFn: ({ pageParam }) => 
            getLpComments(lpid, { 
                cursor: pageParam, 
                limit: 10, 
                order 
            }),

        // v5 필수: 첫 번째 페이지를 불러올 때 사용할 커서 값
        initialPageParam: undefined,

        // v5 필수: 다음 페이지 번호를 어떻게 가져올지 정의
        getNextPageParam: (lastPage) => {
            // API 명세서의 data.hasNext가 true일 때만 nextCursor를 반환
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },

        enabled: !!lpid,
        staleTime: 1000 * 60, // 1분 동안 데이터 유지
    });
}