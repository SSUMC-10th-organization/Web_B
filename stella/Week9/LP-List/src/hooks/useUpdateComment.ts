import { useMutation } from "@tanstack/react-query";
import { updateComment } from "../apis/comment";
import { queryClient } from "../App";
import { QUERY_KEY } from "../constants/key";

function useUpdateComment(lpId: number) {
  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => updateComment(lpId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, lpId],
      });
    },
    onError: () => {
      alert("댓글 수정에 실패했습니다.");
    },
  });
}

export default useUpdateComment;
