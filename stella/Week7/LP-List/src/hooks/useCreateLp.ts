import { useMutation } from "@tanstack/react-query";
import { createLp } from "../apis/lp";
import { queryClient } from "../App";
import { QUERY_KEY } from "../constants/key";

function useCreateLp() {
  return useMutation({
    mutationFn: createLp,
    onSuccess: () => {
      // LP 목록 캐시 무효화 → 자동 리패치
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      alert("LP가 성공적으로 작성되었습니다!");
    },
    onError: () => {
      alert("LP 작성에 실패했습니다.");
    },
  });
}

export default useCreateLp;
