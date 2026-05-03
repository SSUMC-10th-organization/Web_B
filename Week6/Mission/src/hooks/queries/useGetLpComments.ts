import { useQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/lp";

export function useGetLpComments(lpid: string, order : string) {
    return useQuery({
        // 💡 게시글 ID별로 댓글 캐시를 관리하도록 설정
        queryKey: ["comments", lpid, order],
        queryFn: () => getLpComments(lpid, { limit: 10, order}),
        enabled: !!lpid,
        staleTime: 1000 * 60, // 댓글은 더 짧게 설정 (1분)
    });
}