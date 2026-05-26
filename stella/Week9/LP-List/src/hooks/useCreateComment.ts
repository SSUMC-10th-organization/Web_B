import { useMutation } from "@tanstack/react-query";
import { createComment } from "../apis/comment";
import { queryClient } from "../App";
import { QUERY_KEY } from "../constants/key";

function useCreateComment(lpId: number) {
  return useMutation({
    mutationFn: (content: string) => createComment(lpId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, lpId],
      });
    },
    onError: () => {
      alert("댓글 작성에 실패했습니다.");
    },
  });
}

export default useCreateComment;
