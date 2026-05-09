import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer"; // 스크롤 추적
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail";
import { useGetLpComments } from "../hooks/queries/useGetLpComments";
import { QueryState } from "../components/QueryState";
import { PAGINATION_ORDER } from "../apis/common";

export const LpDetailPage = () => {
    const { lpid } = useParams();
    const navigate = useNavigate();

    // 댓글 정렬 상태
    const [commentOrder, setCommentOrder] = useState<typeof PAGINATION_ORDER[keyof typeof PAGINATION_ORDER]>(
        PAGINATION_ORDER.DESC
    );

    // 상세 데이터 패칭
    const { 
        data: lpData, 
        isPending: lpPending, 
        isError: lpError, 
        refetch: lpRefetch 
    } = useGetLpDetail(lpid!);

    // 무한 스크롤 댓글 패칭 (중복 선언 제거 및 변수명 정리)
    const { 
        data: commentData, 
        isPending: commentPending, 
        isError: commentError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch: commentRefetch
    } = useGetLpComments(lpid!, commentOrder);

    // 스크롤 감지 트리거 설정
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // 데이터 가공 (선언 후 사용 원칙 준수)
    const lp = lpData?.data;
    // useInfiniteQuery는 pages 배열 안에 데이터가 있으므로 flatMap으로 펼쳐줍니다.
    const allComments = commentData?.pages.flatMap((page) => page.data.data) || [];

    return (
        <div className="min-h-screen bg-black text-white pt-[15vh] px-[20%] pb-20">
            {/* 메인 상세 정보 QueryState */}
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
                            <button type="button" className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 hover:border-red-500 transition-all">
                                <span>❤️</span>
                                <span className="font-medium">{lp?.likes?.length || 0}</span>
                            </button>
                        </div>
                        <hr className="border-zinc-800 my-6" />
                        <div className="flex-1 text-zinc-300 leading-relaxed min-h-[200px]">
                            {lp?.content || "내용이 없습니다."}
                        </div>
                        <div className="flex justify-end gap-3 mt-10">
                            <button type="button" className="px-6 py-2 rounded-lg bg-zinc-800 text-sm hover:bg-zinc-700 transition-colors text-zinc-300">수정</button>
                            <button type="button" className="px-6 py-2 rounded-lg bg-red-900/20 text-red-400 text-sm hover:bg-red-900/40 transition-colors border border-red-900/30">삭제</button>
                            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors">목록으로</button>
                        </div>
                    </div>
                </div>

                {/* 하단: 댓글 섹션 */}
                <div className="border-t border-zinc-800 pt-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">댓글</h3>
                        <div className="flex gap-3 items-center">
                            <button type="button"
                                onClick={() => setCommentOrder(PAGINATION_ORDER.ASC)}
                                className={`text-[12px] transition-colors ${
                                    commentOrder === PAGINATION_ORDER.ASC ? "text-purple-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                오래된 순
                            </button>
                            <span className="text-zinc-800 text-[10px]">|</span>
                            <button type="button"
                                onClick={() => setCommentOrder(PAGINATION_ORDER.DESC)}
                                className={`text-[12px] transition-colors ${
                                    commentOrder === PAGINATION_ORDER.DESC ? "text-purple-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                최신순
                            </button>
                        </div>
                    </div>

                    {/* 댓글 입력 영역 */}
                    <div className="mb-10 flex flex-col gap-2">
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                placeholder="따뜻한 댓글을 남겨주세요"
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-all text-white"
                            />
                            <button type="button" className="px-8 py-2 bg-purple-600 rounded-lg font-bold text-sm hover:bg-purple-500 transition-colors">
                                등록
                            </button>
                        </div>
                        {/* 유효성 안내 디자인 추가 */}
                        <p className="text-[11px] text-zinc-600 ml-1">공백 포함 100자 이내로 작성해주세요.</p>
                    </div>

                    {/* 댓글 전용 QueryState 적용 */}
                    <QueryState isPending={commentPending} isError={commentError} onRetry={() => commentRefetch()}>
                        <div className="flex flex-col gap-8">
                            {allComments.length > 0 ? (
                                <>
                                    {allComments.map((comment: any) => (
                                        <div key={comment.id} className="flex gap-4 group">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700">
                                                {comment.author?.avatar ? (
                                                    <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 font-bold">P</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1.5 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-zinc-200">{comment.author?.name}</span>
                                                    <span className="text-zinc-600 text-[11px]">{comment.createdAt?.split('T')[0]}</span>
                                                </div>
                                                <p className="text-zinc-400 text-[14px] leading-relaxed">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* 무한 스크롤 트리거 지점 */}
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
        </div>
    );
};