import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetComments from "../hooks/queries/useGetComments";
import { useAuth } from "../context/AuthContext";
import { PAGINATION_ORDER } from "../enums/common";

const CommentSkeleton = () => (
  <div className="flex flex-col gap-2 py-4 border-b border-gray-100">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full" />
      <div className="h-3 bg-gray-200 animate-pulse rounded w-24" />
    </div>
    <div className="h-3 bg-gray-200 animate-pulse rounded w-full" />
    <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4" />
  </div>
);

export const LpDetailPage = () => {
  const { lpId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [commentOrder, setCommentOrder] = useState<PAGINATION_ORDER>(
    PAGINATION_ORDER.desc,
  );
  const [commentInput, setCommentInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, isPending, isError, refetch } = useGetLpDetail(Number(lpId));

  const {
    data: comments,
    isLoading: isCommentsLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetComments(Number(lpId), { order: commentOrder });

  // 비로그인 접근 차단
  useEffect(() => {
    if (!accessToken) {
      const confirmed = window.confirm(
        "로그인이 필요한 서비스입니다. 로그인을 해주세요!",
      );
      if (confirmed) {
        navigate(`/login?redirect=/lp/${lpId}`);
      } else {
        navigate(-1);
      }
    }
  }, [accessToken, lpId, navigate]);

  // 댓글 무한스크롤 트리거
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleProtectedAction = () => {
    if (!accessToken) {
      const confirmed = window.confirm(
        "로그인이 필요한 서비스입니다. 로그인을 해주세요!",
      );
      if (confirmed) {
        navigate(`/login?redirect=/lp/${lpId}`);
      }
      return;
    }
  };

  const toggleCommentOrder = () => {
    setCommentOrder((prev) =>
      prev === PAGINATION_ORDER.desc
        ? PAGINATION_ORDER.asc
        : PAGINATION_ORDER.desc,
    );
  };

  if (isPending) {
    return (
      <div className="p-6 w-full max-w-3xl mx-auto">
        <div className="w-full aspect-square bg-gray-200 animate-pulse rounded-md mb-6" />
        <div className="h-7 bg-gray-200 animate-pulse rounded w-1/2 mb-3" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4 mb-6" />
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4">
        <p className="text-gray-500">데이터를 불러오는데 실패했습니다.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-[#333] transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-3xl mx-auto">
      {/* 썸네일 */}
      <div className="w-full aspect-square bg-gray-100 rounded-md overflow-hidden mb-6">
        {data.thumbnail ? (
          <img
            src={data.thumbnail}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* 제목 + 수정/삭제 */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleProtectedAction}
            className="px-3 py-1.5 text-sm border border-[#444] rounded-md hover:bg-gray-100 transition-colors"
          >
            수정
          </button>
          <button
            onClick={handleProtectedAction}
            className="px-3 py-1.5 text-sm border border-red-400 text-red-400 rounded-md hover:bg-red-50 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>

      {/* 작성자 + 날짜 */}
      <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
        <span>{data.author.name}</span>
        <span>·</span>
        <span>{new Date(data.createdAt).toLocaleDateString("ko-KR")}</span>
      </div>

      {/* 좋아요 */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={handleProtectedAction}
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm border border-[#444] rounded-full hover:bg-gray-100 transition-colors"
        >
          <span>♥</span>
          <span>{data.likes.length}</span>
        </button>
      </div>

      {/* 태그 */}
      {data.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {data.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* 본문 */}
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-10">
        {data.content}
      </p>

      {/* 댓글 섹션 */}
      <div className="border-t border-gray-200 pt-6">
        {/* 댓글 작성란 */}
        <div className="mb-6">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 입력해주세요."
            className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:outline-none focus:border-black transition-colors"
            rows={3}
          />
          {commentInput.length > 0 && commentInput.trim().length === 0 && (
            <p className="text-red-400 text-xs mt-1">
              공백만 입력할 수 없습니다.
            </p>
          )}
          <div className="flex justify-end mt-2">
            <button
              onClick={handleProtectedAction}
              disabled={!commentInput.trim()}
              className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-[#333] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              댓글 작성
            </button>
          </div>
        </div>

        {/* 댓글 정렬 + 개수 */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            댓글 {comments?.pages.length ?? 0}개
          </span>
          <button
            onClick={toggleCommentOrder}
            className="px-3 py-1 text-xs border border-[#444] rounded-md hover:bg-gray-100 transition-colors"
          >
            {commentOrder === PAGINATION_ORDER.desc ? "최신순" : "오래된순"}
          </button>
        </div>

        {/* 댓글 목록 — 초기 로딩 스켈레톤 */}
        {isCommentsLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 4 }).map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {comments?.pages.map((comment) => (
              <div
                key={comment.id}
                className="flex flex-col gap-1 py-4 border-b border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
                    {comment.author.name[0]}
                  </div>
                  <span className="text-sm font-medium">
                    {comment.author.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="text-sm text-gray-700 pl-10">{comment.content}</p>
              </div>
            ))}

            {/* 추가 로딩 — 하단 스켈레톤 */}
            {isFetchingNextPage &&
              Array.from({ length: 2 }).map((_, i) => (
                <CommentSkeleton key={`skeleton-${i}`} />
              ))}
          </div>
        )}

        {/* 무한스크롤 트리거 */}
        <div ref={bottomRef} className="h-10" />
      </div>

      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 text-sm text-gray-400 hover:text-black transition-colors"
      >
        ← 목록으로
      </button>
    </div>
  );
};
