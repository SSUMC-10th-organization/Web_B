import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLp } from "../apis/lp";
import { QUERY_KEY } from "../constants/key";

export const useUpdateLp = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Parameters<typeof updateLp>[1]) => updateLp(lpId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, lpId] }); // "lp"로 수정
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      alert("수정되었습니다.");
    },
  });
};
