import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as lpApi from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

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

  return {
    createLp,
    deleteLp,
    createComment,
    updateComment,
    deleteComment,
  };
};