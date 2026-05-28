import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpDetail(lpId: number) {
  return useQuery({
    queryKey: [QUERY_KEY.lp, lpId],
    queryFn: () => getLpDetail(lpId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    select: (data) => data.data,
    enabled: !!lpId,
  });
}

export default useGetLpDetail;
