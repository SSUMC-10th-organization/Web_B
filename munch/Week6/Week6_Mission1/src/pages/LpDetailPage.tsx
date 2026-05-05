import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetComments from "../hooks/queries/useGetComments";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { LoadingSpinner, ErrorFallback } from "../components/CommonStates";
import { CommentSkeleton } from "../components/Skeletons";
import { formatTimeAgo } from "../utils/date";
import { getMyInfo } from "../apis/auth";
import { createComment } from "../apis/comment";
import type { PAGINATION_ORDER } from "../enums/common";

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const queryClient = useQueryClient();
  const [commentOrder, setCommentOrder] = useState<PAGINATION_ORDER>("desc");
  const [commentInput, setCommentInput] = useState("");

  const { data, isPending, isError, refetch } = useGetLpDetail(Number(lpid));

  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    select: (data) => data.data,
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

  const { mutate: submitComment, isPending: isSubmitting } = useMutation({
    mutationFn: () => createComment(Number(lpid), { content: commentInput }),
    onSuccess: () => {
      setCommentInput("");
      queryClient.invalidateQueries({
        queryKey: ["lpComments", Number(lpid)],
      });
    },
  });

  const isAuthor = myInfo?.id === data?.author?.id;
  const comments = commentData?.pages.flatMap((page) => page.data.data) ?? [];

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
          <h1 className="text-2xl font-bold text-white">{data.title}</h1>
          {isAuthor && (
            <div className="flex gap-3 text-gray-400">
              <button
                type="button"
                className="hover:text-white transition-colors"
                aria-label="수정"
              >
                ✏️
              </button>
              <button
                type="button"
                className="hover:text-red-400 transition-colors"
                aria-label="삭제"
              >
                🗑️
              </button>
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

        <p className="text-gray-300 text-center max-w-2xl text-sm leading-relaxed mb-8">
          {data.content}
        </p>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {data.tags?.map((tag) => (
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
          className="flex items-center gap-2 text-[#e91e8c] hover:scale-110 transition-transform"
        >
          <span className="text-2xl">♥</span>
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
            Array.from({ length: 3 }).map((_, i) => (
              <CommentSkeleton key={`c-sk-${i}`} />
            ))}

          {isCommentError && <ErrorFallback onRetry={refetchComments} />}

          {!isCommentPending &&
            !isCommentError &&
            comments.map((comment) => (
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
                  <p className="text-sm text-gray-300 break-words">
                    {comment.content}
                  </p>
                </div>
                {myInfo?.id === comment.authorId && (
                  <button
                    type="button"
                    className="text-gray-500 hover:text-white px-2 shrink-0"
                  >
                    ⋮
                  </button>
                )}
              </div>
            ))}

          {isFetchingNextPage &&
            Array.from({ length: 2 }).map((_, i) => (
              <CommentSkeleton key={`c-more-sk-${i}`} />
            ))}
        </div>

        <div ref={loadMoreCommentsRef} className="h-4 w-full mt-2" />
      </div>
    </div>
  );
};

export default LpDetailPage;
