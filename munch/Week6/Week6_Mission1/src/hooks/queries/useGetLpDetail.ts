import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import type { LpDetail } from "../../types/lp";

function useGetLpDetail(lpId: number) {
  return useQuery<LpDetail>({
    queryKey: ["lp", lpId],
    queryFn: async () => {
      const res = await getLpDetail(lpId);
      return res.data;
    },
    enabled: !!lpId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpDetail;
