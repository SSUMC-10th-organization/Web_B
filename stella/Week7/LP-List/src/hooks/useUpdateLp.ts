import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLp } from "../apis/lp";

export const useUpdateLp = (lpId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Parameters<typeof updateLp>[1]) => updateLp(lpId, body),
    onSuccess: () => {
      // 상세 데이터와 리스트 데이터를 새로고침합니다.
      queryClient.invalidateQueries({ queryKey: ["lpDetail", lpId] });
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      alert("수정되었습니다.");
    },
  });
};
