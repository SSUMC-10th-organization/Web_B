import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getLps, type Lp } from "../apis/lp";
import LpCard from "../components/LpCard";
import SkeletonCard from "../components/SkeletonCard";

type LpPage = { data: Lp[]; hasNext: boolean; nextCursor: number | null };

export default function HomePage() {
	const [order, setOrder] = useState<"asc" | "desc">("desc");
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
			<div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
				{(["desc", "asc"] as const).map((o) => (
					<button
						key={o}
						type="button"
						onClick={() => setOrder(o)}
						style={{
							padding: "0.4rem 1rem",
							borderRadius: "999px",
							border: `1px solid ${order === o ? "#000" : "#d1d5db"}`,
							background: order === o ? "#000" : "#fff",
							color: order === o ? "#fff" : "#000",
							cursor: "pointer",
							fontWeight: order === o ? "bold" : "normal",
						}}
					>
						{o === "desc" ? "최신순" : "오래된순"}
					</button>
				))}
			</div>

			{/* 초기 로딩 스켈레톤 */}
			{isLoading && (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
						gap: "0.75rem",
					}}
				>
					{Array.from({ length: 10 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: 스켈레톤은 순서 고정
						<SkeletonCard key={i} />
					))}
				</div>
			)}

			{/* 에러 */}
			{isError && (
				<div style={{ textAlign: "center", padding: "2rem" }}>
					<p style={{ color: "#ef4444", marginBottom: "1rem" }}>
						데이터를 불러오지 못했어요.
					</p>
					<button
						type="button"
						onClick={() => refetch()}
						style={{
							padding: "0.5rem 1.5rem",
							borderRadius: "6px",
							border: "1px solid #d1d5db",
							cursor: "pointer",
						}}
					>
						다시 시도
					</button>
				</div>
			)}

			{/* LP 그리드 */}
			{!isLoading && (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
						gap: "0.75rem",
					}}
				>
					{data?.pages
						.flatMap((page) => page.data)
						.map((lp) => (
							<LpCard key={lp.id} lp={lp} />
						))}
				</div>
			)}

			{/* 하단 추가 로딩 스켈레톤 */}
			{isFetchingNextPage && (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
						gap: "0.75rem",
						marginTop: "0.75rem",
					}}
				>
					{Array.from({ length: 4 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: 스켈레톤은 순서 고정
						<SkeletonCard key={i} />
					))}
				</div>
			)}

			<div ref={sentinelRef} style={{ height: 1 }} />

			{/* 플로팅 버튼 */}
			<button
				type="button"
				style={{
					position: "fixed",
					bottom: "2rem",
					right: "2rem",
					width: "48px",
					height: "48px",
					borderRadius: "50%",
					background: "#ec4899",
					color: "#fff",
					fontSize: "1.5rem",
					border: "none",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
				}}
			>
				+
			</button>
		</div>
	);
}
