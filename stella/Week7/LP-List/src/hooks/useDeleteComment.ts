import { useMutation } from "@tanstack/react-query";
import { deleteComment } from "../apis/comment";
import { queryClient } from "../App";
import { QUERY_KEY } from "../constants/key";

function useDeleteComment(lpId: number) {
  return useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, lpId],
      });
    },
    onError: () => {
      alert("댓글 삭제에 실패했습니다.");
    },
  });
}

export default useDeleteComment;
