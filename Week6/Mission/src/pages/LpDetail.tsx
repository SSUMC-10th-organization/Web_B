import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail";
import { useGetLpComments } from "../hooks/queries/useGetLpComments";
import { QueryState } from "../components/QueryState";
import { PAGINATION_ORDER } from "../apis/common";

export const LpDetailPage = () => {
    const { lpid } = useParams();
    const navigate = useNavigate();

    // 댓글 정렬 상태 (타입 에러 방지를 위한 명시적 타입 지정)
    const [commentOrder, setCommentOrder] = useState<typeof PAGINATION_ORDER[keyof typeof PAGINATION_ORDER]>(
        PAGINATION_ORDER.DESC
    );

    // 데이터 패칭 (상세 정보 및 댓글 목록)
    const { 
        data: lpData, 
        isPending: lpPending, 
        isError: lpError, 
        refetch: lpRefetch 
    } = useGetLpDetail(lpid!);

    const { data: commentData } = useGetLpComments(lpid!, commentOrder);

    const lp = lpData?.data;
    const comments = commentData?.data?.data || [];

    return (
        <div className="min-h-screen bg-black text-white pt-[15vh] px-[20%] pb-20">
            <QueryState isPending={lpPending} isError={lpError} onRetry={() => lpRefetch()}>
                {/* 상단: LP 상세 정보 섹션 */}
                <div className="flex gap-12 mb-16">
                    {/* 좌측: 썸네일 */}
                    <div className="w-1/3 aspect-square rounded-xl overflow-hidden border border-zinc-800 shadow-2xl flex-shrink-0">
                        <img src={lp?.thumbnail} alt={lp?.title} className="w-full h-full object-cover" />
                    </div>

                    {/* 우측: 메타 정보 및 본문 */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{lp?.title}</h1>
                                <p className="text-zinc-500 text-sm">업로드일: {lp?.createdAt?.split('T')[0]}</p>
                            </div>
                            {/* 좋아요 버튼 */}
                            <button type="button" className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 hover:border-red-500 transition-all">
                                <span>❤️</span>
                                <span className="font-medium">{lp?.likes?.length || 0}</span>
                            </button>
                        </div>

                        <hr className="border-zinc-800 my-6" />

                        {/* 본문 내용 */}
                        <div className="flex-1 text-zinc-300 leading-relaxed min-h-[200px]">
                            {lp?.content || "내용이 없습니다."}
                        </div>

                        {/* 하단 버튼 바 */}
                        <div className="flex justify-end gap-3 mt-10">
                            <button type="button" className="px-6 py-2 rounded-lg bg-zinc-800 text-sm hover:bg-zinc-700 transition-colors text-zinc-300">수정</button>
                            <button type="button" className="px-6 py-2 rounded-lg bg-red-900/20 text-red-400 text-sm hover:bg-red-900/40 transition-colors border border-red-900/30">삭제</button>
                            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors">목록으로</button>
                        </div>
                    </div>
                </div>

                {/* 하단: 댓글 섹션 */}
                <div className="border-t border-zinc-800 pt-10">
                    {/* 댓글 헤더: 제목과 정렬 버튼을 양 끝으로 배치 */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">댓글</h3>

                        {/* 정렬 버튼 (이미지의 빨간 박스 위치) */}
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
                    <div className="mb-10 flex gap-4">
                        <input 
                            type="text" 
                            placeholder="따뜻한 댓글을 남겨주세요"
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-all text-white"
                        />
                        <button type="button" className="px-8 py-2 bg-purple-600 rounded-lg font-bold text-sm hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/20">
                            등록
                        </button>
                    </div>

                    {/* 댓글 목록 리스트 */}
                    <div className="flex flex-col gap-8">
                        {comments.length > 0 ? (
                            comments.map((comment: any) => (
                                <div key={comment.id} className="flex gap-4 group">
                                    {/* 아바타 */}
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700">
                                        {comment.author?.avatar ? (
                                            <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 font-bold">P</div>
                                        )}
                                    </div>
                                    {/* 댓글 내용 */}
                                    <div className="flex flex-col gap-1.5 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-zinc-200">{comment.author?.name}</span>
                                            <span className="text-zinc-600 text-[11px]">{comment.createdAt?.split('T')[0]}</span>
                                        </div>
                                        <p className="text-zinc-400 text-[14px] leading-relaxed">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-zinc-600 text-center py-20 text-sm bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                                아직 작성된 댓글이 없습니다. 첫 댓글을 남겨보세요!
                            </div>
                        )}
                    </div>
                </div>
            </QueryState>
        </div>
    );
};