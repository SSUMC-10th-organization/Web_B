import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getLps, type Lp } from "../apis/lp";
import LpCard from "../components/LpCard";
import SkeletonCard from "../components/SkeletonCard";
import useDebounce from "../hooks/useDebounce";

type LpPage = { data: Lp[]; hasNext: boolean; nextCursor: number | null };

export default function SearchPage() {
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 300);
	const sentinelRef = useRef<HTMLDivElement>(null);

	const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery<LpPage, Error, { pages: LpPage[] }, string[], number | undefined>({
			queryKey: ["search", debouncedQuery],
			queryFn: ({ pageParam }) => getLps(pageParam, 10, "desc", debouncedQuery),
			initialPageParam: undefined,
			getNextPageParam: (lastPage) =>
				lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
			enabled: debouncedQuery.trim().length > 0,
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 10,
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

	const lps: Lp[] = data?.pages.flatMap((p) => p.data) ?? [];

	return (
		<div>
			{/* 검색 입력 */}
			<div className="relative mb-2">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="LP 제목이나 내용으로 검색하세요..."
					className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-pink-400"
				/>
				{query && (
					<button
						type="button"
						onClick={() => setQuery("")}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
					>
						✕
					</button>
				)}
			</div>

			{/* Debounce 상태 표시 */}
			<div className="flex items-center gap-2 text-xs text-gray-400 mb-4 px-1">
				<span
					className={`w-2 h-2 rounded-full transition-colors ${
						query !== debouncedQuery && query.length > 0
							? "bg-yellow-400 animate-pulse"
							: "bg-green-500"
					}`}
				/>
				{query !== debouncedQuery && query.length > 0 ? (
					<span>입력 대기 중 — 0.3초 후 API 호출</span>
				) : debouncedQuery ? (
					<span>"{debouncedQuery}" 검색 중</span>
				) : (
					<span>태그를 입력하면 0.3초 후 API를 호출합니다</span>
				)}
			</div>

			{/* 초기 로딩 */}
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
				<p className="text-center text-red-500 py-8">검색 중 오류가 발생했습니다.</p>
			)}

			{/* 결과 없음 */}
			{!isLoading && debouncedQuery && lps.length === 0 && (
				<p className="text-center text-gray-400 py-8">검색 결과가 없습니다.</p>
			)}

			{/* LP 그리드 */}
			{!isLoading && (
				<div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
					{lps.map((lp) => (
						<LpCard key={lp.id} lp={lp} />
					))}
				</div>
			)}

			{/* 추가 로딩 */}
			{isFetchingNextPage && (
				<div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 mt-3">
					{Array.from({ length: 4 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: 스켈레톤은 순서 고정
						<SkeletonCard key={i} />
					))}
				</div>
			)}

			<div ref={sentinelRef} className="h-px" />
		</div>
	);
}
