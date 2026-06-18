import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getLps, type Lp } from "../apis/lp";
import AddLpModal from "../components/AddLpModal";
import LpCard from "../components/LpCard";
import SkeletonCard from "../components/SkeletonCard";
import useThrottle from "../hooks/useThrottle";

const THROTTLE_INTERVAL = 5000;

type LpPage = { data: Lp[]; hasNext: boolean; nextCursor: number | null };

export default function HomePage() {
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [showModal, setShowModal] = useState(false);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const [scrollY, setScrollY] = useState(0);
	const throttledScrollY = useThrottle(scrollY, THROTTLE_INTERVAL);

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

	const hasNextPageRef = useRef(hasNextPage);
	const isFetchingRef = useRef(isFetchingNextPage);
	useEffect(() => {
		hasNextPageRef.current = hasNextPage;
		isFetchingRef.current = isFetchingNextPage;
	}, [hasNextPage, isFetchingNextPage]);

	// 스크롤 이벤트 등록
	useEffect(() => {
		const handleScroll = () => setScrollY(window.scrollY);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// [최적화 2] useCallback: AddLpModal의 onClose prop으로 넘기는 함수 참조 안정화
	// HomePage가 리렌더돼도 이 함수는 새로 생성되지 않음
	const handleOpenModal = useCallback(() => setShowModal(true), []);
	const handleCloseModal = useCallback(() => setShowModal(false), []);

	// [최적화 3] useMemo: data가 바뀔 때만 flatMap 실행
	// showModal 변경 등으로 리렌더될 때 불필요한 배열 재생성 방지
	const lps = useMemo(
		() => data?.pages.flatMap((page) => page.data) ?? [],
		[data],
	);

	// throttledScrollY 기준으로만 하단 감지 → 3초에 한 번만 fetchNextPage 호출
	useEffect(() => {
		const scrollBottom = throttledScrollY + window.innerHeight;
		const pageBottom = document.documentElement.scrollHeight - 100;
		if (
			scrollBottom >= pageBottom &&
			hasNextPageRef.current &&
			!isFetchingRef.current
		) {
			fetchNextPage();
		}
	}, [throttledScrollY, fetchNextPage]);

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
					{lps.map((lp) => (
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
				onClick={handleOpenModal}
				className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-pink-500 text-white text-2xl border-0 cursor-pointer flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
			>
				+
			</button>

			{showModal && <AddLpModal onClose={handleCloseModal} />}
		</div>
	);
}
