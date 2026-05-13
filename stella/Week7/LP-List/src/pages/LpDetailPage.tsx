import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMyInfo } from "../apis/auth";
import { uploadImagePublic } from "../apis/upload";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetComments from "../hooks/queries/useGetComments";
import useCreateComment from "../hooks/useCreateComment";
import useUpdateComment from "../hooks/useUpdateComment";
import useDeleteComment from "../hooks/useDeleteComment";
import useLikeLp from "../hooks/useLikeLp";
import { useUpdateLp } from "../hooks/useUpdateLp";
import { useDeleteLp } from "../hooks/useDeleteLp";
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
  const numLpId = Number(lpId);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [commentOrder, setCommentOrder] = useState<PAGINATION_ORDER>(
    PAGINATION_ORDER.desc,
  );
  const [commentInput, setCommentInput] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    thumbnail: "",
    tags: "",
  });

  const {
    data: lpDetail,
    isPending,
    isError,
    refetch,
  } = useGetLpDetail(numLpId);

  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });

  const {
    data: comments,
    isLoading: isCommentsLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetComments(numLpId, { order: commentOrder });

  const myId = myInfo?.data?.id;
  const isAuthor = myId === lpDetail?.authorId;
  const isLiked = lpDetail?.likes.some((like) => like.userId === myId);

  const { mutate: updateLp, isPending: isUpdatingLp } = useUpdateLp(numLpId);
  const { mutate: deleteLp } = useDeleteLp(numLpId);
  const { mutate: createComment, isPending: isCreating } =
    useCreateComment(numLpId);
  const { mutate: updateComment, isPending: isUpdating } =
    useUpdateComment(numLpId);
  const { mutate: deleteComment } = useDeleteComment(numLpId);
  const { mutate: toggleLike } = useLikeLp(numLpId, myId);

  // 문제 1 수정 — accessToken이 undefined(초기화 중)일 때는 실행하지 않음
  useEffect(() => {
    if (accessToken === null) {
      const confirmed = window.confirm("로그인이 필요한 서비스입니다.");
      if (confirmed) {
        navigate(`/login?redirect=/lp/${lpId}`);
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [accessToken, lpId, navigate]);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const imageUrl = await uploadImagePublic(e.target.files[0]);
        setEditForm((prev) => ({ ...prev, thumbnail: imageUrl }));
      } catch {
        alert("이미지 업로드에 실패했습니다.");
      }
    }
  };

  const handleUpdateLpSubmit = () => {
    if (!editForm.title.trim() || !editForm.content.trim()) return;
    updateLp(
      {
        title: editForm.title,
        content: editForm.content,
        thumbnail: editForm.thumbnail,
        tags: editForm.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        published: true,
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleCreateComment = () => {
    if (!commentInput.trim()) return;
    createComment(commentInput, { onSuccess: () => setCommentInput("") });
  };

  const handleUpdateComment = (commentId: number) => {
    if (!editingContent.trim()) return;
    updateComment(
      { commentId, content: editingContent },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditingContent("");
        },
      },
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

  if (isError || !lpDetail) {
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
      {isEditing ? (
        <div className="flex flex-col gap-6">
          <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden group">
            <img
              src={editForm.thumbnail}
              className="w-full h-full object-cover"
              alt="preview"
            />
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              이미지 변경
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="flex flex-col gap-4">
            <input
              className="text-2xl font-bold border-b border-gray-200 pb-2 focus:outline-none focus:border-black"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              placeholder="제목을 입력하세요"
            />
            <input
              className="text-sm text-blue-500 border-b border-gray-100 pb-2 focus:outline-none"
              value={editForm.tags}
              onChange={(e) =>
                setEditForm({ ...editForm, tags: e.target.value })
              }
              placeholder="태그 (쉼표로 구분: 예. 재즈, 명반)"
            />
            <textarea
              className="min-h-[300px] text-gray-700 leading-relaxed border p-4 rounded-md focus:outline-none focus:border-black"
              value={editForm.content}
              onChange={(e) =>
                setEditForm({ ...editForm, content: e.target.value })
              }
              placeholder="내용을 입력하세요"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleUpdateLpSubmit}
              disabled={isUpdatingLp}
              className="px-6 py-2 bg-black text-white rounded-md disabled:bg-gray-300 transition-colors"
            >
              {isUpdatingLp ? "저장 중..." : "수정 완료"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full aspect-square bg-gray-100 rounded-md overflow-hidden mb-6">
            {lpDetail.thumbnail ? (
              <img
                src={lpDetail.thumbnail}
                alt={lpDetail.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold">{lpDetail.title}</h1>
            {isAuthor && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditForm({
                      title: lpDetail.title,
                      content: lpDetail.content,
                      thumbnail: lpDetail.thumbnail,
                      tags: lpDetail.tags.map((t) => t.name).join(", "),
                    });
                    setIsEditing(true);
                  }}
                  className="px-3 py-1.5 text-sm border border-[#444] rounded-md hover:bg-gray-100 transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={() =>
                    window.confirm("삭제하시겠습니까?") && deleteLp()
                  }
                  className="px-3 py-1.5 text-sm border border-red-400 text-red-400 rounded-md hover:bg-red-50 transition-colors"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
            <span>{lpDetail.author.name}</span>
            <span>·</span>
            <span>
              {new Date(lpDetail.createdAt).toLocaleDateString("ko-KR")}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => toggleLike(isLiked)}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-sm border rounded-full transition-colors ${
                isLiked
                  ? "border-red-400 text-red-400 hover:bg-red-50"
                  : "border-[#444] hover:bg-gray-100"
              }`}
            >
              <span>{isLiked ? "♥" : "♡"}</span>
              <span>{lpDetail.likes.length}</span>
            </button>
          </div>

          {lpDetail.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {lpDetail.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-10">
            {lpDetail.content}
          </p>

          {/* 댓글 섹션 */}
          <div className="border-t border-gray-200 pt-6">
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
                  onClick={handleCreateComment}
                  disabled={!commentInput.trim() || isCreating}
                  className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-[#333] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isCreating ? "작성 중..." : "댓글 작성"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                댓글 {comments?.pages.length ?? 0}개
              </span>
              <button
                onClick={() =>
                  setCommentOrder((prev) =>
                    prev === PAGINATION_ORDER.desc
                      ? PAGINATION_ORDER.asc
                      : PAGINATION_ORDER.desc,
                  )
                }
                className="px-3 py-1 text-xs border border-[#444] rounded-md hover:bg-gray-100 transition-colors"
              >
                {commentOrder === PAGINATION_ORDER.desc ? "최신순" : "오래된순"}
              </button>
            </div>

            {/* 문제 2 수정 — select로 이미 flatMap된 pages 배열 직접 사용 */}
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
                          {comment.author.name[0]}
                        </div>
                        <span className="text-sm font-medium">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "ko-KR",
                          )}
                        </span>
                      </div>
                      {myId === comment.authorId && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === comment.id ? null : comment.id,
                              )
                            }
                            className="px-2 text-gray-400 hover:text-black transition-colors"
                          >
                            • • •
                          </button>
                          {openMenuId === comment.id && (
                            <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-md shadow-md z-10 w-20">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingContent(comment.content);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => {
                                  deleteComment(comment.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-50 transition-colors"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {editingCommentId === comment.id ? (
                      <div className="flex gap-2 mt-1 pl-10">
                        <input
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-black"
                        />
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={isUpdating}
                          className="px-3 py-1.5 text-xs bg-black text-white rounded-md hover:bg-[#333] transition-colors disabled:bg-gray-300"
                        >
                          {isUpdating ? "저장 중..." : "저장"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditingContent("");
                          }}
                          className="px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 pl-10">
                        {comment.content}
                      </p>
                    )}
                  </div>
                ))}

                {isFetchingNextPage &&
                  Array.from({ length: 2 }).map((_, i) => (
                    <CommentSkeleton key={`skeleton-${i}`} />
                  ))}
              </div>
            )}

            <div ref={bottomRef} className="h-10" />
          </div>
        </>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-6 text-sm text-gray-400 hover:text-black transition-colors"
      >
        ← 목록으로
      </button>
    </div>
  );
};
