import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// APIs & Hooks
import { getMyInfo } from "../apis/auth";
import { uploadImagePublic } from "../apis/upload";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetComments from "../hooks/queries/useGetComments";
import useCreateComment from "../hooks/useCreateComment";
import useUpdateComment from "../hooks/useUpdateComment";
import useDeleteComment from "../hooks/useDeleteComment";
import { useUpdateLp } from "../hooks/useUpdateLp";
import { useDeleteLp } from "../hooks/useDeleteLp";

// Context & Enums
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

  // --- UI 및 댓글 관련 상태 ---
  const [commentOrder, setCommentOrder] = useState<PAGINATION_ORDER>(
    PAGINATION_ORDER.desc,
  );
  const [commentInput, setCommentInput] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- LP 수정 모드 관련 상태 ---
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    thumbnail: "",
    tags: "",
  });

  // --- Queries ---
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

  // --- Mutations ---
  const { mutate: updateLp, isPending: isUpdatingLp } = useUpdateLp(numLpId);
  const { mutate: deleteLp } = useDeleteLp(numLpId);
  const { mutate: createComment, isPending: isCreating } =
    useCreateComment(numLpId);
  const { mutate: updateComment, isPending: isUpdating } =
    useUpdateComment(numLpId);
  const { mutate: deleteComment } = useDeleteComment(numLpId);

  // --- Effects ---
  useEffect(() => {
    if (!accessToken) {
      const confirmed = window.confirm("로그인이 필요한 서비스입니다.");
      if (confirmed) navigate(`/login?redirect=/lp/${lpId}`);
      else navigate(-1);
    }
  }, [accessToken, lpId, navigate]);

  useEffect(() => {
    if (lpDetail && isEditing) {
      setEditForm({
        title: lpDetail.title,
        content: lpDetail.content,
        thumbnail: lpDetail.thumbnail,
        tags: lpDetail.tags.map((t) => t.name).join(", "),
      });
    }
  }, [lpDetail, isEditing]);

  // --- Handlers (LP) ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const imageUrl = await uploadImagePublic(e.target.files[0]);
        setEditForm((prev) => ({ ...prev, thumbnail: imageUrl }));
      } catch (error) {
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
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  // --- Handlers (Comments) ---
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

  if (isPending || !lpDetail)
    return <div className="p-6 w-full max-w-3xl mx-auto">로딩 중...</div>;

  const myId = myInfo?.data?.id;
  const isAuthor = myId === lpDetail.authorId;

  return (
    <div className="p-6 w-full max-w-3xl mx-auto">
      {isEditing ? (
        /* --- 수정 모드 UI --- */
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
        /* --- 조회 모드 UI --- */
        <>
          <div className="w-full aspect-square bg-gray-100 rounded-md overflow-hidden mb-6">
            <img
              src={lpDetail.thumbnail}
              alt={lpDetail.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold">{lpDetail.title}</h1>
            {isAuthor && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setIsEditing(true)}
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
            {/* 댓글 입력 UI... (기존 코드와 동일) */}
            <div className="mb-6">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="댓글을 입력해주세요."
                className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:outline-none focus:border-black"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleCreateComment}
                  disabled={!commentInput.trim() || isCreating}
                  className="px-4 py-2 text-sm bg-black text-white rounded-md disabled:bg-gray-300"
                >
                  {isCreating ? "작성 중..." : "댓글 작성"}
                </button>
              </div>
            </div>

            {/* 댓글 목록 렌더링... (기존 리스트 로직) */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                댓글 {comments?.pages[0]?.data.length ?? 0}개
              </span>
              <button
                onClick={() =>
                  setCommentOrder((prev) =>
                    prev === PAGINATION_ORDER.desc
                      ? PAGINATION_ORDER.asc
                      : PAGINATION_ORDER.desc,
                  )
                }
                className="px-3 py-1 text-xs border border-[#444] rounded-md"
              >
                {commentOrder === PAGINATION_ORDER.desc ? "최신순" : "오래된순"}
              </button>
            </div>

            <div className="flex flex-col">
              {comments?.pages.map((page) =>
                page.data.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="flex flex-col gap-1 py-4 border-b border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                          {comment.author.name[0]}
                        </div>
                        <span className="text-sm font-medium">
                          {comment.author.name}
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
                            className="px-2 text-gray-400"
                          >
                            • • •
                          </button>
                          {openMenuId === comment.id && (
                            <div className="absolute right-0 top-6 bg-white border rounded-md shadow-lg z-10 w-20">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingContent(comment.content);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => deleteComment(comment.id)}
                                className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {editingCommentId === comment.id ? (
                      <div className="flex gap-2 mt-2 pl-10">
                        <input
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="flex-1 border rounded px-2 py-1 text-sm"
                        />
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          className="text-xs bg-black text-white px-2 py-1 rounded"
                        >
                          저장
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 pl-10">
                        {comment.content}
                      </p>
                    )}
                  </div>
                )),
              )}
            </div>
          </div>
        </>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-6 text-sm text-gray-400 hover:text-black"
      >
        ← 목록으로
      </button>
    </div>
  );
};
