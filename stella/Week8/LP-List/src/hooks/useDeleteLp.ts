import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp } from "../apis/lp";
import { useNavigate } from "react-router-dom";

export const useDeleteLp = (lpId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => deleteLp(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      alert("삭제되었습니다.");
      navigate("/", { replace: true }); // 목록으로 이동
    },
  });
};
