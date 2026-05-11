import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import { createComment, deleteComment, updateComment } from "../apis/comment";
import { deleteLp, likeLp, unlikeLp, updateLp } from "../apis/lp";
import { ErrorFallback, LoadingSpinner } from "../components/CommonStates";
import ConfirmModal from "../components/ConfirmModal";
import { CommentSkeleton } from "../components/Skeletons";
import type { PAGINATION_ORDER } from "../enums/common";
import useGetComments from "../hooks/queries/useGetComments";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import type { ResponseMyInfoDto } from "../types/auth";
import type { Comment, ResponseCommentListDto } from "../types/comment";
import type { LpDetail, Tag } from "../types/lp";
import { formatTimeAgo } from "../utils/date";
import { toast } from "../components/toast";

const initCommentSkeletonKeys = Array.from(
  { length: 3 },
  (_, i) => `c-sk-${i}`,
);
const moreCommentSkeletonKeys = Array.from(
  { length: 2 },
  (_, i) => `c-more-sk-${i}`,
);

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditingLp, setIsEditingLp] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isDeleteLpModalOpen, setIsDeleteLpModalOpen] = useState(false);

  const [commentOrder, setCommentOrder] = useState<PAGINATION_ORDER>("desc");
  const [commentInput, setCommentInput] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const { data, isPending, isError, refetch } = useGetLpDetail(Number(lpid));

  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    select: (res: ResponseMyInfoDto) => res.data,
  });

  const {
    data: commentData,
    isPending: isCommentPending,
    isError: isCommentError,
    refetch: refetchComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetComments(Number(lpid), commentOrder);

  const loadMoreCommentsRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage,
  );

  const { mutate: submitEditLp, isPending: isEditingLpPending } = useMutation({
    mutationFn: () =>
      updateLp(Number(lpid), { title: editTitle, content: editContent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", Number(lpid)] });
      toast.success("LP가 수정되었습니다.");
      setIsEditingLp(false);
    },
    onError: () => {
      toast.error("LP 수정에 실패했습니다.");
    },
  });

  const { mutate: removeLp } = useMutation({
    mutationFn: () => deleteLp(Number(lpid)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      toast.success("LP가 삭제되었습니다.");
      navigate("/");
    },
    onError: () => {
      toast.error("LP 삭제에 실패했습니다.");
    },
  });

  const lpQueryKey = ["lp", Number(lpid)];

  const isLiked =
    data?.likes.some((like) => like.userId === myInfo?.id) ?? false;

  const { mutate: toggleLike } = useMutation({
    mutationFn: (currentIsLiked: boolean) =>
      currentIsLiked ? unlikeLp(Number(lpid)) : likeLp(Number(lpid)),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: lpQueryKey });

      const previousData = queryClient.getQueryData(lpQueryKey);

      const currentIsLiked = isLiked;

      queryClient.setQueryData(lpQueryKey, (old: LpDetail) => {
        if (!old) return old;
        const likes = old.likes;
        const updatedLikes = currentIsLiked
          ? likes.filter((like) => like.userId !== myInfo?.id)
          : [
              ...likes,
              { id: Date.now(), userId: myInfo?.id ?? 0, lpId: Number(lpid) },
            ];

        return {
          ...old,
          likes: updatedLikes,
        };
      });

      return { previousData, currentIsLiked };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(lpQueryKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: lpQueryKey });
    },
  });

  const { mutate: submitComment, isPending: isSubmitting } = useMutation({
    mutationFn: () => createComment(Number(lpid), { content: commentInput }),
    onSuccess: () => {
      setCommentInput("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", Number(lpid)] });
    },
    onError: () => {
      toast.error("댓글 작성에 실패했습니다.");
    },
  });

  const { mutate: submitEditComment } = useMutation({
    mutationFn: (commentId: number) =>
      updateComment(Number(lpid), commentId, { content: editingContent }),
    onSuccess: () => {
      setEditingCommentId(null);
      setEditingContent("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", Number(lpid)] });
      toast.success("댓글이 수정되었습니다.");
    },
    onError: () => {
      toast.error("댓글 수정에 실패했습니다.");
    },
  });

  const { mutate: removeComment } = useMutation({
    mutationFn: (commentId: number) => deleteComment(Number(lpid), commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", Number(lpid)] });
      toast.success("댓글이 삭제되었습니다.");
    },
    onError: () => {
      toast.error("댓글 삭제에 실패했습니다.");
    },
  });

  const isAuthor = myInfo?.id === data?.author?.id;
  const comments: Comment[] =
    commentData?.pages.flatMap(
      (page: ResponseCommentListDto) => page.data.data,
    ) ?? [];

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorFallback onRetry={refetch} />;
  if (!data)
    return (
      <div className="text-center py-20 text-gray-400">
        데이터를 찾을 수 없습니다.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col items-center bg-[#1a1a1a] p-10 rounded-2xl shadow-xl mb-10">
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {data.author?.name?.[0] ?? "?"}
            </div>
            <span className="text-gray-200 font-medium text-sm">
              {data.author?.name ?? "알 수 없음"}
            </span>
          </div>
          <span className="text-gray-400 text-xs">
            {formatTimeAgo(data.createdAt)}
          </span>
        </div>

        <div className="w-full flex justify-between items-center mb-8">
          {isEditingLp ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 bg-[#2a2a2a] text-white border border-gray-600 rounded px-3 py-1 text-lg font-bold focus:outline-none focus:border-[#e91e8c] mr-3"
            />
          ) : (
            <h1 className="text-2xl font-bold text-white">{data.title}</h1>
          )}

          {isAuthor && (
            <div className="flex gap-3 text-gray-400 shrink-0">
              {isEditingLp ? (
                <>
                  <button
                    type="button"
                    onClick={() => submitEditLp()}
                    disabled={isEditingLpPending}
                    className="text-[#e91e8c] hover:text-white text-sm transition-colors disabled:text-gray-600"
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingLp(false)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditTitle(data.title);
                      setEditContent(data.content);
                      setIsEditingLp(true);
                    }}
                    className="hover:text-white transition-colors"
                    aria-label="수정"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteLpModalOpen(true)}
                    className="hover:text-red-400 transition-colors"
                    aria-label="삭제"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="relative w-80 h-80 rounded-full overflow-hidden shadow-2xl mb-12 animate-[spin_12s_linear_infinite]">
          <img
            src={data.thumbnail}
            alt={data.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 m-auto w-12 h-12 bg-[#1a1a1a] rounded-full border border-gray-600 pointer-events-none" />
        </div>

        {isEditingLp ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            className="w-full bg-[#2a2a2a] text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#e91e8c] mb-8 resize-none"
          />
        ) : (
          <p className="text-gray-300 text-center max-w-2xl text-sm leading-relaxed mb-8">
            {data.content}
          </p>
        )}

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {data.tags?.map((tag: Tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs border border-gray-700"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => toggleLike(isLiked)}
          className={`flex items-center gap-2 hover:scale-110 transition-transform ${
            isLiked ? "text-[#e91e8c]" : "text-gray-500 hover:text-[#e91e8c]"
          }`}
        >
          <span className="text-2xl">{isLiked ? "♥" : "♡"}</span>
          <span className="font-semibold text-lg">
            {data.likes?.length || 0}
          </span>
        </button>
      </div>

      <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">댓글</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCommentOrder("asc")}
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                commentOrder === "asc"
                  ? "bg-white text-black border-white font-semibold"
                  : "border-gray-600 text-gray-400 hover:border-gray-400"
              }`}
            >
              오래된순
            </button>
            <button
              type="button"
              onClick={() => setCommentOrder("desc")}
              className={`px-3 py-1 text-xs rounded border transition-colors ${
                commentOrder === "desc"
                  ? "bg-white text-black border-white font-semibold"
                  : "border-gray-600 text-gray-400 hover:border-gray-400"
              }`}
            >
              최신순
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="댓글을 입력해주세요"
              className="flex-1 bg-[#2a2a2a] text-white border border-gray-700 rounded p-3 text-sm focus:outline-none focus:border-[#e91e8c]"
            />
            <button
              type="button"
              onClick={() => {
                if (commentInput.trim()) submitComment();
              }}
              disabled={!commentInput.trim() || isSubmitting}
              className="px-6 py-2 bg-[#e91e8c] text-white rounded font-medium hover:bg-[#c2185b] transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              작성
            </button>
          </div>
          <span className="text-xs text-gray-500 px-1">
            욕설 및 비방은 제재될 수 있습니다.
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {isCommentPending &&
            initCommentSkeletonKeys.map((key) => <CommentSkeleton key={key} />)}

          {isCommentError && <ErrorFallback onRetry={refetchComments} />}

          {!isCommentPending &&
            !isCommentError &&
            comments.map((comment: Comment) => (
              <div
                key={comment.id}
                className="flex gap-4 py-4 border-b border-gray-800 last:border-0"
              >
                <div className="w-10 h-10 bg-[#e91e8c] rounded-full flex items-center justify-center text-white font-bold shrink-0">
                  {comment.author.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-gray-200 text-sm">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  {editingCommentId === comment.id ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="flex-1 bg-[#2a2a2a] text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#e91e8c]"
                      />
                      <button
                        type="button"
                        onClick={() => submitEditComment(comment.id)}
                        className="text-[#e91e8c] hover:text-white transition-colors"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCommentId(null)}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-300 break-words">
                      {comment.content}
                    </p>
                  )}
                </div>

                {myInfo?.id === comment.authorId && (
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === comment.id ? null : comment.id,
                        )
                      }
                      className="text-gray-500 hover:text-white px-2"
                    >
                      ⋮
                    </button>
                    {openMenuId === comment.id && (
                      <div className="absolute right-0 top-6 bg-[#2a2a2a] border border-gray-700 rounded shadow-lg z-10 min-w-[80px]">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditingContent(comment.content);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-3 py-2 text-xs text-left text-gray-300 hover:text-white hover:bg-gray-700 flex items-center gap-1"
                        >
                          ✏️ 수정
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            removeComment(comment.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-3 py-2 text-xs text-left text-gray-300 hover:text-red-400 hover:bg-gray-700 flex items-center gap-1"
                        >
                          🗑️ 삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

          {isFetchingNextPage &&
            moreCommentSkeletonKeys.map((key) => <CommentSkeleton key={key} />)}
        </div>

        <div ref={loadMoreCommentsRef} className="h-4 w-full mt-2" />
      </div>

      {isDeleteLpModalOpen && (
        <ConfirmModal
          message="정말 이 LP를 삭제하시겠습니까?"
          onConfirm={() => {
            setIsDeleteLpModalOpen(false);
            removeLp();
          }}
          onCancel={() => setIsDeleteLpModalOpen(false)}
        />
      )}
    </div>
  );
};

export default LpDetailPage;
