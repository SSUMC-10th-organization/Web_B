import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpDetail } from "../../apis/lp"; // API 함수가 있다고 가정

export function useGetLpDetail(lpid: string) {
    return useQuery({
        // 💡 lpid를 키에 포함하여 각 LP마다 별도의 캐시를 생성합니다.
        queryKey: [QUERY_KEY.lps, lpid], 
        queryFn: () => getLpDetail(lpid),
        staleTime: 1000 * 60 * 5,
        enabled: !!lpid, // lpid가 있을 때만 실행
    });
}