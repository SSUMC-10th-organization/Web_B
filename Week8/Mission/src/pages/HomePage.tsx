import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetLpList } from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../apis/common";
import { useInView } from "react-intersection-observer";
import { CreateLpModal } from "../components/createLpModal";
import { useLpMutation } from "../hooks/mutations/useLpMutations";
import { useDebounce } from "../hooks/useDebounce";

// 타입 인터페이스 정의 (빨간 줄 제거용)
interface Lp {
    id: number;
    title: string;
    thumbnail: string;
    createdAt: string;
    likes: any[];
}

interface LpPageResponse {
    data: {
        data: Lp[];
        nextCursor: number;
        hasNext: boolean;
    };
}

const LpCardSkeleton = () => (
    <div className="aspect-square bg-zinc-900 rounded-lg border border-zinc-800 animate-pulse flex flex-col justify-end p-3 gap-2">
        <div className="h-3 w-3/4 bg-zinc-800 rounded" />
        <div className="h-2 w-1/2 bg-zinc-800 rounded" />
        <div className="h-2 w-1/4 bg-zinc-800 rounded" />
    </div>
);

export const HomePage = () => {
    const { tokenA } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [order, setOrder] = useState<typeof PAGINATION_ORDER[keyof typeof PAGINATION_ORDER]>(PAGINATION_ORDER.DESC);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const debouncedSearch = useDebounce(search, 300);
    const isEnabled = debouncedSearch === "" || debouncedSearch.trim().length > 0;
    
    const { 
        data, 
        isPending, 
        isError, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage,
    } = useGetLpList({ search: debouncedSearch, order: order, limit: 20, enabled:isEnabled });

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // page 매개변수에 타입 지정 (Implicit any 해결)
    const allLps = data?.pages.flatMap((page: LpPageResponse) => page.data.data) || [];


    return (
        <div className="min-h-screen bg-black text-white pt-[20vh] px-[20%] pb-20">
            {tokenA ? (
                <>
                    <div className="flex flex-col">
                        <div className="flex flex-col items-end mb-6 gap-4">
                            <input 
                                type="text"
                                placeholder="LP 제목이나 내용을 검색해보세요"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-72 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-all"
                            />
                        </div> 

                        <div className="flex justify-end mb-6 gap-3 items-center">
                            <button type="button"
                                onClick={() => setOrder(PAGINATION_ORDER.ASC)}
                                className={`text-[12px] transition-colors ${
                                    order === PAGINATION_ORDER.ASC ? "text-purple-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                오래된 순
                            </button>
                            <span className="text-zinc-800 text-[10px]">|</span>
                            <button type="button"
                                onClick={() => setOrder(PAGINATION_ORDER.DESC)}
                                className={`text-[12px] transition-colors ${
                                    order === PAGINATION_ORDER.DESC ? "text-purple-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                최신순
                            </button>
                        </div>

                        <div className="grid grid-cols-5 gap-4">
                            {isPending ? (
                                // key 값에 고유 문자열 추가 (Index Key 경고 해결)
                                Array.from({ length: 15 }).map((_, i) => <LpCardSkeleton key={crypto.randomUUID()} />)
                            ) : (
                                <>
                                    {allLps.map((lp: Lp) => (
                                        <button type="button" 
                                            key={lp.id} 
                                            onClick={() => navigate(`/lp/${lp.id}`)}
                                            className="group relative aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-purple-500 transition-all cursor-pointer shadow-2xl"
                                        >
                                            <img 
                                                src={lp.thumbnail} 
                                                alt={lp.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />

                                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-left">
                                                <h2 className="text-[12px] font-bold text-white truncate mb-1">
                                                    {lp.title}
                                                </h2>
                                                <p className="text-[10px] text-zinc-400 mb-2">
                                                    {lp.createdAt?.toString().split('T')[0]}
                                                </p>
                                                <div className="flex items-center gap-1 text-purple-400">
                                                    <span className="text-[10px]">❤️</span>
                                                    <span className="text-[10px] font-medium">
                                                        {lp.likes?.length || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}

                                    {isFetchingNextPage && (
                                        // 추가 로딩용 키 고유화
                                        Array.from({ length: 5 }).map((_, i) => <LpCardSkeleton key={crypto.randomUUID()} />)
                                    )}
                                </>
                            )}
                        </div>

                        <div ref={ref} className="h-10 w-full" />
                    </div>

                    <button 
                        type="button"
                        className="fixed bottom-10 right-10 w-16 h-16 bg-purple-600 hover:bg-purple-500 text-white rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all active:scale-95 z-50 cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        +
                    </button>

                    <CreateLpModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                    />
                </>
            ) : (
                <div className="flex justify-center">
                    <span className="text-4xl font-bold text-gray-400 transition-all duration-500">
                        로그인 후 이용해주세요
                    </span>
                </div>
            )}
        </div>
    );
};