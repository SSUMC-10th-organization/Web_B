import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. 추가
import { useAuth } from "../context/AuthContext";
import { useGetLpList } from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../apis/common";

export const HomePage = () => {
    const { tokenA } = useAuth();
    const navigate = useNavigate();
	const [search, setSearch] = useState(""); // 검색
    const [order, setOrder] = useState<typeof PAGINATION_ORDER[keyof typeof PAGINATION_ORDER]>(PAGINATION_ORDER.DESC);
	const { data } = useGetLpList({ limit: 20, order, search }); // 한번에 20개씩 불러오기, 정렬, 검색

    return (
        <div className="min-h-screen bg-black text-white pt-[20vh] px-[20%]">
            {tokenA ? (
                <div className="flex flex-col">
					<div className="flex flex-col items-end mb-6 gap-4">
                        {/*검색창 추가. 현재는 입력 하나하나가 서버에 전송되어, 향후 확장시 이 부분은 개선 필요 */}
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

                    {/* LP 그리드 */}
                    <div className="grid grid-cols-5 gap-4">
                        {data?.data?.data?.map((lp) => (
                            <button type="button" 
                                key={lp.id} 
                                onClick={() => navigate(`/lp/${lp.id}`)} // 3. 추가
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
                    </div>
                </div>
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