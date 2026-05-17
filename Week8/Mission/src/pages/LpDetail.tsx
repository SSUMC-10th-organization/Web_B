import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail";
import { useGetLpComments } from "../hooks/queries/useGetLpComments";
import { QueryState } from "../components/QueryState";
import { PAGINATION_ORDER } from "../apis/common";
import { useLpMutation } from "../hooks/mutations/useLpMutations";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../apis/axiosInstance";

type CommentPageResponse = {
  data: {
    data: any[]; // 댓글 배열 (시간 나면 여기도 Comment 타입으로 정의하면 좋음)
  };
};

export const LpDetailPage = () => {
    const { lpid } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    // 통합 Mutation에서 기능 꺼내오기
    const { deleteLp, createComment, updateComment, deleteComment, toggleLike } = useLpMutation(lpid);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    useEffect(() => {
        const getMyInfo = async () => {
            try {
                const response = await api.get("/v1/users/me");
                const userData = response.data.data;
                setCurrentUserId(userData.id); // 내 ID 저장
            } catch (error) {
                console.error("내 정보를 가져오는데 실패했습니다.", error);
            }
        };
        getMyInfo();
    }, []);
    // 상태 관리
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commentOrder, setCommentOrder] = useState<typeof PAGINATION_ORDER[keyof typeof PAGINATION_ORDER]>(PAGINATION_ORDER.DESC);
    
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    

    // 데이터 패칭
    const { data: lpData, isPending: lpPending, isError: lpError, refetch: lpRefetch } = useGetLpDetail(lpid!);
    const { data: commentData, isPending: commentPending, isError: commentError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch: commentRefetch } = useGetLpComments(lpid!, commentOrder);
    
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const lp = lpData?.data;
    const allComments = commentData?.pages.flatMap((page : CommentPageResponse) => page.data.data) || [];
    const isLiked = lp?.likes?.some((like: any) => Number(like.userId) === Number(currentUserId));

    // --- 핸들러 로직 ---

    const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);

    const confirmDeleteLp = () => {
        deleteLp.mutate(undefined, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setTimeout(() => navigate("/", { replace: true }), 100);
            },
        });
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        createComment.mutate(newComment, {
            onSuccess: () => {
                queryClient.resetQueries({ queryKey: ["lpComments", lpid] });
                setNewComment("");
            }
        });
    };

    const handleStartEdit = (comment: any) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
        setOpenMenuId(null);
    };

    const handleUpdateComment = (commentId: number) => {
        if (!editContent.trim()) return;
        updateComment.mutate({ id: commentId, content: editContent }, {
            onSuccess: () => {
                queryClient.resetQueries({ queryKey: ["lpComments", lpid] });
                setEditingId(null);
                setEditContent("");
            }
        });
    };

    const handleDeleteComment = (commentId: number) => {
            deleteComment.mutate(commentId, {
                onSuccess: () => {
                    queryClient.resetQueries({ queryKey: ["lpComments", lpid] });
                    setOpenMenuId(null);
                }
            });
    };

    return (
        <div className="min-h-screen bg-black text-white pt-[15vh] px-[20%] pb-20">
            <QueryState isPending={lpPending} isError={lpError} onRetry={() => lpRefetch()}>
                <div className="flex gap-12 mb-16">
                    <div className="w-1/3 aspect-square rounded-xl overflow-hidden border border-zinc-800 shadow-2xl flex-shrink-0">
                        <img src={lp?.thumbnail} alt={lp?.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{lp?.title}</h1>
                                <p className="text-zinc-500 text-sm">업로드일: {lp?.createdAt?.split('T')[0]}</p>
                            </div>
                            <button 
                                type="button"
                                disabled={toggleLike.isPending} 
                                onClick={() => {
                                    if (currentUserId) {
                                        toggleLike.mutate({currentUserId, isCurrentlyLiked: isLiked});
                                    } else {
                                        console.error("로그인이 필요합니다.");
                                    }
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                                    isLiked 
                                        ? "bg-red-900/20 border-red-500 text-red-400" 
                                        : "bg-zinc-900 border-zinc-800 hover:border-red-500 text-zinc-400"
                                }`}
                            >
                                <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
                                <span className="font-bold">{lp?.likes?.length || 0}</span>
                            </button>
                        </div>
                        <hr className="border-zinc-800 my-6" />
                        <div className="flex-1 text-zinc-300 leading-relaxed min-h-[200px]">
                            {lp?.content || "내용이 없습니다."}
                        </div>
                        <div className="flex justify-end gap-3 mt-10">
                            <button type="button" className="px-6 py-2 rounded-lg bg-zinc-800 text-sm hover:bg-zinc-700 transition-colors text-zinc-300">수정</button>
                            <button 
                                type="button" 
                                onClick={handleOpenDeleteModal} 
                                disabled={deleteLp.isPending} 
                                className="px-6 py-2 rounded-lg bg-red-900/20 text-red-400 text-sm hover:bg-red-900/40 transition-colors border border-red-900/30 disabled:opacity-50"
                            >
                                {deleteLp.isPending ? "삭제 중..." : "삭제"}
                            </button>
                            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors">목록으로</button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-800 pt-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">댓글</h3>
                        <div className="flex gap-3 items-center">
                            <button type="button" onClick={() => setCommentOrder(PAGINATION_ORDER.ASC)} className={`text-[12px] transition-colors ${commentOrder === PAGINATION_ORDER.ASC ? "text-purple-400 font-bold" : "text-zinc-500 hover:text-zinc-300"}`}>오래된 순</button>
                            <span className="text-zinc-800 text-[10px]">|</span>
                            <button type="button" onClick={() => setCommentOrder(PAGINATION_ORDER.DESC)} className={`text-[12px] transition-colors ${commentOrder === PAGINATION_ORDER.DESC ? "text-purple-400 font-bold" : "text-zinc-500 hover:text-zinc-300"}`}>최신순</button>
                        </div>
                    </div>

                    <div className="mb-10 flex flex-col gap-2">
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                placeholder="따뜻한 댓글을 남겨주세요"
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-all text-white"
                            />
                            <button 
                                type="button" 
                                onClick={handleAddComment}
                                disabled={createComment.isPending || !newComment.trim()}
                                className="px-8 py-2 bg-purple-600 rounded-lg font-bold text-sm hover:bg-purple-500 transition-colors disabled:opacity-50"
                            >
                                {createComment.isPending ? "등록 중" : "등록"}
                            </button>
                        </div>
                        <p className="text-[11px] text-zinc-600 ml-1">공백 포함 100자 이내로 작성해주세요.</p>
                    </div>

                    <QueryState isPending={commentPending} isError={commentError} onRetry={() => commentRefetch()}>
                        <div className="flex flex-col gap-8">
                            {allComments.length > 0 ? (
                                <>
                                    {allComments.map((comment: any) => (
                                        <div key={comment.id} className="flex gap-4 group">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700">
                                                {comment.author?.avatar ? (
                                                    <img src={comment.author.avatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 font-bold">P</div>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col gap-1.5 flex-1 relative">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm text-zinc-200">{comment.author?.name}</span>
                                                        <span className="text-zinc-600 text-[11px]">{comment.createdAt?.split('T')[0]}</span>
                                                    </div>

                                                    {comment.authorId === currentUserId && (
                                                        <div className="relative">
                                                            <button 
                                                                type="button" 
                                                                onClick={() => setOpenMenuId(openMenuId === comment.id ? null : comment.id)}
                                                                className="text-zinc-500 hover:text-white px-2 font-bold"
                                                            >
                                                                ⋮
                                                            </button>
                                                            {openMenuId === comment.id && (
                                                                <div className="absolute right-0 mt-1 w-24 bg-[#2d2f36] rounded-md shadow-lg overflow-hidden z-10 border border-zinc-700">
                                                                    <button type="button" onClick={() => handleStartEdit(comment)} className="w-full text-left px-4 py-2 text-xs hover:bg-zinc-700">수정</button>
                                                                    <button type="button" onClick={() => handleDeleteComment(comment.id)} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-zinc-700">삭제</button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {editingId === comment.id ? (
                                                    <div className="flex flex-col gap-2 mt-1">
                                                        <input 
                                                            type="text" 
                                                            value={editContent} 
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                            className="w-full bg-zinc-900 border border-purple-500 rounded px-3 py-2 text-sm text-white focus:outline-none"
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <button type="button" onClick={() => setEditingId(null)} className="text-xs text-zinc-400 hover:text-white">취소</button>
                                                            <button type="button" onClick={() => handleUpdateComment(comment.id)} disabled={updateComment.isPending} className="text-xs text-purple-400 font-bold hover:text-purple-300">
                                                                {updateComment.isPending ? "저장 중..." : "저장"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-zinc-400 text-[14px] leading-relaxed">{comment.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={ref} className="h-20 flex items-center justify-center">
                                        {isFetchingNextPage && <p className="text-zinc-500 text-sm">더 불러오는 중...</p>}
                                    </div>
                                </>
                            ) : (
                                <div className="text-zinc-600 text-center py-20 text-sm bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                                    아직 작성된 댓글이 없습니다. 첫 댓글을 남겨보세요!
                                </div>
                            )}
                        </div>
                    </QueryState>
                </div>
            </QueryState>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <button type="button" className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default outline-none" onClick={() => setIsDeleteModalOpen(false)} />
                    <div className="relative bg-[#2d2f36] w-[320px] p-6 rounded-2xl flex flex-col items-center gap-5 shadow-2xl border border-zinc-700">
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-white mb-2">LP 삭제</h3>
                            <p className="text-sm text-zinc-400">정말 이 LP를 삭제하시겠습니까?<br/>삭제 후에는 복구할 수 없습니다.</p>
                        </div>
                        <div className="flex gap-3 w-full mt-2">
                            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl bg-zinc-700 text-white text-sm font-bold hover:bg-zinc-600 transition-colors">취소</button>
                            <button type="button" onClick={confirmDeleteLp} disabled={deleteLp.isPending} className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-500 transition-colors disabled:opacity-50">{deleteLp.isPending ? "삭제 중..." : "삭제"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};