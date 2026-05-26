import { useMutation } from "@tanstack/react-query";
import { likeLp, unlikeLp } from "../apis/lp";
import { queryClient } from "../App";
import { QUERY_KEY } from "../constants/key";
import type { ResponseLpDetailDto } from "../types/lp";

function useLikeLp(lpId: number, myId: number | undefined) {
  return useMutation({
    mutationFn: (isLiked: boolean) => (isLiked ? unlikeLp(lpId) : likeLp(lpId)),
    onMutate: async (isLiked: boolean) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lp, lpId] });

      const previousLpDetail = queryClient.getQueryData<ResponseLpDetailDto>([
        QUERY_KEY.lp,
        lpId,
      ]);

      // 낙관적으로 즉시 업데이트
      queryClient.setQueryData<ResponseLpDetailDto>(
        [QUERY_KEY.lp, lpId],
        (old) => {
          if (!old) return old;
          const updatedLikes = isLiked
            ? old.data.likes.filter((like) => like.userId !== myId) // 좋아요 취소
            : [...old.data.likes, { id: Date.now(), userId: myId!, lpId }]; // 좋아요 추가

          return {
            ...old,
            data: {
              ...old.data,
              likes: updatedLikes,
            },
          };
        },
      );

      return { previousLpDetail };
    },
    onError: (_error, _variables, context) => {
      // 실패 시 롤백
      if (context?.previousLpDetail) {
        queryClient.setQueryData(
          [QUERY_KEY.lp, lpId],
          context.previousLpDetail,
        );
      }
      alert("좋아요 처리에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, lpId] });
    },
  });
}

export default useLikeLp;
