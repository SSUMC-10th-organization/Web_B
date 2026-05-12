import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getLps, type Lp } from "../apis/lp";
import AddLpModal from "../components/AddLpModal";
import LpCard from "../components/LpCard";
import SkeletonCard from "../components/SkeletonCard";

type LpPage = { data: Lp[]; hasNext: boolean; nextCursor: number | null };

export default function HomePage() {
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [showModal, setShowModal] = useState(false);
	const sentinelRef = useRef<HTMLDivElement>(null);

	const {
		data,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery<
		LpPage,
		Error,
		{ pages: LpPage[] },
		string[],
		number | undefined
	>({
		queryKey: ["lps", order],
		queryFn: ({ pageParam }) => getLps(pageParam, 10, order),
		initialPageParam: undefined,
		getNextPageParam: (lastPage) =>
			lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 6,
	});

	useEffect(() => {
		if (!sentinelRef.current) return;
		const el = sentinelRef.current;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	return (
		<div>
			{/* 정렬 버튼 */}
			<div className="flex gap-2 mb-4">
				{(["desc", "asc"] as const).map((o) => (
					<button
						key={o}
						type="button"
						onClick={() => setOrder(o)}
						className={`px-4 py-[0.4rem] rounded-full border cursor-pointer ${
							order === o
								? "border-black bg-black text-white font-bold"
								: "border-gray-300 bg-white text-black font-normal"
						}`}
					>
						{o === "desc" ? "최신순" : "오래된순"}
					</button>
				))}
			</div>

			{/* 초기 로딩 스켈레톤 */}
			{isLoading && (
				<div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
					{Array.from({ length: 10 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: 스켈레톤은 순서 고정
						<SkeletonCard key={i} />
					))}
				</div>
			)}

			{/* 에러 */}
			{isError && (
				<div className="text-center p-8">
					<p className="text-red-500 mb-4">데이터를 불러오지 못했어요.</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="px-6 py-2 rounded-md border border-gray-300 cursor-pointer"
					>
						다시 시도
					</button>
				</div>
			)}

			{/* LP 그리드 */}
			{!isLoading && (
				<div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
					{data?.pages
						.flatMap((page) => page.data)
						.map((lp) => (
							<LpCard key={lp.id} lp={lp} />
						))}
				</div>
			)}

			{/* 하단 추가 로딩 스켈레톤 */}
			{isFetchingNextPage && (
				<div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 mt-3">
					{Array.from({ length: 4 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: 스켈레톤은 순서 고정
						<SkeletonCard key={i} />
					))}
				</div>
			)}

			<div ref={sentinelRef} className="h-px" />

			{/* 플로팅 버튼 */}
			<button
				type="button"
				onClick={() => setShowModal(true)}
				className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-pink-500 text-white text-2xl border-0 cursor-pointer flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
			>
				+
			</button>

			{showModal && <AddLpModal onClose={() => setShowModal(false)} />}
		</div>
	);
}
