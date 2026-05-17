import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as lpApi from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { api } from "../../apis/axiosInstance";

export const useLpMutation = (lpid?: string) => {
  const queryClient = useQueryClient();
  
  // 댓글 관련 쿼리 키 (상세 페이지에서 lpid가 있을 때만 사용)
  const commentKey = ["comments", lpid];

  // LP 게시글 생성
  const createLp = useMutation({
    mutationFn: lpApi.createLp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpList"] });
    },
  });

  const deleteLp = useMutation({
    mutationFn: () => {
      if (!lpid) throw new Error("LP ID가 없습니다.");
      return lpApi.deleteLp(lpid);
    },
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });

  // 댓글 작성
  const createComment = useMutation({
    mutationFn: (content: string) => {
      if (!lpid) throw new Error("lpid가 필요합니다.");
      return lpApi.createComment(lpid, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKey });
    },
  });

  // 댓글 수정
  const updateComment = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) => {
      if (!lpid) throw new Error("lpid가 필요합니다.");
      return lpApi.updateComment(lpid, id, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKey });
    },
  });

  // 댓글 삭제
  const deleteComment = useMutation({
    mutationFn: (id: number) => {
      if (!lpid) throw new Error("lpid가 필요합니다.");
      return lpApi.deleteComment(lpid, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKey });
    },
  });

  const toggleLike = useMutation({
    // ✅ 1. 현재 좋아요 상태에 따라 POST 또는 DELETE 호출
    mutationFn: async ({ currentUserId, isCurrentlyLiked }: { currentUserId: number, isCurrentlyLiked: boolean }) => {
      if (!lpid) throw new Error("LP ID가 없습니다.");
      
      if (isCurrentlyLiked) {
        // 이미 눌린 상태면 좋아요 취소
        const response = await api.delete(`/v1/lps/${lpid}/likes`);
        return response.data;
      } else {
        // 안 눌린 상태면 좋아요 추가
        const response = await api.post(`/v1/lps/${lpid}/likes`);
        return response.data;
      }
    },

    // ✅ 2. 낙관적 업데이트 로직 (키 값: [QUERY_KEY.lps, lpid])
    onMutate: async ({ currentUserId, isCurrentlyLiked }) => {
      // 쿼리 취소 및 이전 데이터 스냅샷
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lps, lpid] });
      const previousLp = queryClient.getQueryData([QUERY_KEY.lps, lpid]);

      // 캐시 데이터 즉시 수정
      queryClient.setQueryData([QUERY_KEY.lps, lpid], (old: any) => {
        if (!old || !old.data) return old;

        const currentLikes = old.data.likes || [];

        const newLikes = isCurrentlyLiked
          ? currentLikes.filter((like: any) => Number(like.userId) !== Number(currentUserId)) // 취소: 내 ID 제거
          : [...currentLikes, { id: Date.now(), userId: currentUserId, lpId: Number(lpid) }]; // 추가: 가짜 객체 삽입

        return {
          ...old,
          data: {
            ...old.data,
            likes: newLikes,
          },
        };
      });

      return { previousLp };
    },

    onError: (error, variables, context) => {
      console.error("좋아요 에러:", error);
      if (context?.previousLp) {
        queryClient.setQueryData([QUERY_KEY.lps, lpid], context.previousLp);
      }
    },

    onSettled: () => {
      // 성공/실패 여부 상관없이 서버 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, lpid] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });

  return {
    createLp,
    deleteLp,
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
  };
};