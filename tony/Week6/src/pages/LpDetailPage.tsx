import {
	useInfiniteQuery,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";
import {
	type Comment,
	deleteComment,
	deleteLike,
	deleteLp,
	getLpComments,
	getLpDetail,
	postComment,
	postLike,
	updateLp,
} from "../apis/lp";
import { getMyProfile } from "../apis/user";
import SkeletonComment from "../components/SkeletonComment";
import { tokenStorage } from "../lib/tokenStorage";

type CommentPage = {
	data: Comment[];
	hasNext: boolean;
	nextCursor: number | null;
};

const formatRelativeDate = (dateStr: string) => {
	const days = Math.floor(
		(Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
	);
	if (days === 0) return "오늘";
	return `${days}일 전`;
};

const AvatarCircle = ({
	name,
	avatar,
	size = 36,
}: {
	name: string;
	avatar?: string | null;
	size?: number;
}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: "50%",
			overflow: "hidden",
			flexShrink: 0,
			background: "#ec4899",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		}}
	>
		{avatar ? (
			<img
				src={avatar}
				alt={name}
				style={{ width: "100%", height: "100%", objectFit: "cover" }}
			/>
		) : (
			<span style={{ color: "#fff", fontWeight: "bold", fontSize: size * 0.4 }}>
				{name?.[0]?.toUpperCase()}
			</span>
		)}
	</div>
);

export default function LpDetailPage() {
	const { lpId } = useParams<{ lpId: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const queryClient = useQueryClient();
	const isLoggedIn = !!tokenStorage.getAccessToken();

	const [searchParams, setSearchParams] = useSearchParams();
	const commentOrder = (searchParams.get("order") as "asc" | "desc") ?? "desc";
	const [commentText, setCommentText] = useState("");
	const [isSubmittingComment, setIsSubmittingComment] = useState(false);
	const sentinelRef = useRef<HTMLDivElement>(null);

	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(0);
	const [isLiking, setIsLiking] = useState(false);

	const [showEditModal, setShowEditModal] = useState(false);
	const [editTitle, setEditTitle] = useState("");
	const [editContent, setEditContent] = useState("");
	const [editThumbnail, setEditThumbnail] = useState("");
	const [editYear, setEditYear] = useState<number>(0);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const id = Number(lpId);

	// 비로그인 처리
	useEffect(() => {
		if (!isLoggedIn) {
			alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
			navigate("/login", { state: { from: location }, replace: true });
		}
	}, [isLoggedIn, navigate, location]);

	const { data: me } = useQuery({
		queryKey: ["me"],
		queryFn: getMyProfile,
		enabled: isLoggedIn,
		staleTime: 1000 * 60 * 5,
	});

	const {
		data: lp,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["lp", id],
		queryFn: () => getLpDetail(id),
		enabled: !!id && isLoggedIn,
		staleTime: 1000 * 60 * 5,
	});

	useEffect(() => {
		if (lp) setLikeCount(lp.likeCount);
	}, [lp]);

	const {
		data: commentsData,
		isLoading: isCommentsLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery<
		CommentPage,
		Error,
		{ pages: CommentPage[] },
		(string | number)[],
		number | undefined
	>({
		queryKey: ["lpComments", id, commentOrder],
		queryFn: ({ pageParam }) => getLpComments(id, pageParam, 10, commentOrder),
		initialPageParam: undefined,
		getNextPageParam: (lastPage) =>
			lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
		enabled: !!id && isLoggedIn,
	});

	useEffect(() => {
		if (!sentinelRef.current) return;
		const el = sentinelRef.current;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage)
				fetchNextPage();
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	const isAuthor = !!me && !!lp && me.id === lp.author.id;

	const handleLikeToggle = async () => {
		if (isLiking) return;
		setIsLiking(true);
		try {
			if (isLiked) {
				await deleteLike(id);
				setIsLiked(false);
				setLikeCount((c) => c - 1);
			} else {
				await postLike(id);
				setIsLiked(true);
				setLikeCount((c) => c + 1);
			}
		} finally {
			setIsLiking(false);
		}
	};

	const handleCommentSubmit = async () => {
		if (!commentText.trim() || isSubmittingComment) return;
		setIsSubmittingComment(true);
		try {
			await postComment(id, commentText.trim());
			setCommentText("");
			queryClient.invalidateQueries({ queryKey: ["lpComments", id] });
		} finally {
			setIsSubmittingComment(false);
		}
	};

	const handleCommentDelete = async (commentId: number) => {
		if (!confirm("댓글을 삭제하시겠습니까?")) return;
		try {
			await deleteComment(id, commentId);
			queryClient.invalidateQueries({ queryKey: ["lpComments", id] });
		} catch {
			alert("댓글 삭제에 실패했습니다.");
		}
	};

	const handleEditOpen = () => {
		if (!lp) return;
		setEditTitle(lp.title);
		setEditContent(lp.content);
		setEditThumbnail(lp.thumbnail);
		setEditYear(lp.publishedYear);
		setShowEditModal(true);
	};

	const handleEditSubmit = async () => {
		setIsUpdating(true);
		try {
			await updateLp(id, {
				title: editTitle,
				content: editContent,
				thumbnail: editThumbnail,
				publishedYear: editYear,
			});
			await queryClient.invalidateQueries({ queryKey: ["lp", id] });
			setShowEditModal(false);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDelete = async () => {
		if (!confirm("정말 삭제하시겠습니까?")) return;
		setIsDeleting(true);
		try {
			await deleteLp(id);
			queryClient.invalidateQueries({ queryKey: ["lps"] });
			navigate("/");
		} finally {
			setIsDeleting(false);
		}
	};

	if (!isLoggedIn) return null;

	if (isLoading)
		return (
			<div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
				로딩 중...
			</div>
		);

	if (isError)
		return (
			<div style={{ padding: "3rem", textAlign: "center" }}>
				<p style={{ color: "#ef4444", marginBottom: "1rem" }}>
					불러오지 못했어요.
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
		);

	return (
		<div style={{ maxWidth: "680px", margin: "0 auto" }}>
			{/* 수정 모달 */}
			{showEditModal && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(0,0,0,0.5)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 100,
					}}
				>
					<div
						style={{
							background: "#fff",
							borderRadius: "12px",
							padding: "2rem",
							width: "90%",
							maxWidth: "480px",
							display: "flex",
							flexDirection: "column",
							gap: "0.75rem",
						}}
					>
						<h2 style={{ fontSize: "1.1rem", fontWeight: "bold" }}>LP 수정</h2>
						<input
							value={editTitle}
							onChange={(e) => setEditTitle(e.target.value)}
							placeholder="제목"
							style={{
								padding: "0.6rem 1rem",
								borderRadius: "6px",
								border: "1px solid #d1d5db",
								fontSize: "0.9rem",
							}}
						/>
						<textarea
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							placeholder="내용"
							rows={4}
							style={{
								padding: "0.6rem 1rem",
								borderRadius: "6px",
								border: "1px solid #d1d5db",
								fontSize: "0.9rem",
								resize: "vertical",
							}}
						/>
						<input
							value={editThumbnail}
							onChange={(e) => setEditThumbnail(e.target.value)}
							placeholder="썸네일 URL"
							style={{
								padding: "0.6rem 1rem",
								borderRadius: "6px",
								border: "1px solid #d1d5db",
								fontSize: "0.9rem",
							}}
						/>
						<input
							type="number"
							value={editYear}
							onChange={(e) => setEditYear(Number(e.target.value))}
							placeholder="발매년도"
							style={{
								padding: "0.6rem 1rem",
								borderRadius: "6px",
								border: "1px solid #d1d5db",
								fontSize: "0.9rem",
							}}
						/>
						<div
							style={{
								display: "flex",
								gap: "0.5rem",
								justifyContent: "flex-end",
							}}
						>
							<button
								type="button"
								onClick={() => setShowEditModal(false)}
								style={{
									padding: "0.5rem 1.25rem",
									borderRadius: "6px",
									border: "1px solid #d1d5db",
									cursor: "pointer",
								}}
							>
								취소
							</button>
							<button
								type="button"
								onClick={handleEditSubmit}
								disabled={isUpdating}
								style={{
									padding: "0.5rem 1.25rem",
									borderRadius: "6px",
									border: "none",
									background: "#ec4899",
									color: "#fff",
									cursor: "pointer",
								}}
							>
								{isUpdating ? "저장 중..." : "저장"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 작성자 정보 + 날짜 */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "1rem",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
					<AvatarCircle
						name={lp?.author.name ?? ""}
						avatar={lp?.author.avatar}
					/>
					<span style={{ fontWeight: "bold", fontSize: "0.95rem" }}>
						{lp?.author.name}
					</span>
				</div>
				<span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
					{lp?.createdAt ? formatRelativeDate(lp.createdAt) : ""}
				</span>
			</div>

			{/* 제목 + 수정/삭제 */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "1.25rem",
				}}
			>
				<h1 style={{ fontSize: "1.6rem", fontWeight: "bold", margin: 0 }}>
					{lp?.title}
				</h1>
				{isAuthor && (
					<div style={{ display: "flex", gap: "0.5rem" }}>
						<button
							type="button"
							onClick={handleEditOpen}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								fontSize: "1.1rem",
								color: "#6b7280",
							}}
							title="수정"
						>
							✏️
						</button>
						<button
							type="button"
							onClick={handleDelete}
							disabled={isDeleting}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								fontSize: "1.1rem",
								color: "#6b7280",
							}}
							title="삭제"
						>
							🗑️
						</button>
					</div>
				)}
			</div>

			{/* LP 이미지 */}
			{lp?.thumbnail && (
				<img
					src={lp.thumbnail}
					alt={lp.title}
					style={{
						width: "100%",
						aspectRatio: "1/1",
						objectFit: "cover",
						borderRadius: "12px",
						marginBottom: "1.5rem",
						display: "block",
					}}
				/>
			)}

			{/* 본문 */}
			<p
				style={{
					lineHeight: 1.8,
					color: "#374151",
					marginBottom: "1.5rem",
					fontSize: "0.95rem",
				}}
			>
				{lp?.content}
			</p>

			{/* 태그 */}
			{lp?.tags && lp.tags.length > 0 && (
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: "0.4rem",
						marginBottom: "1.5rem",
					}}
				>
					{lp.tags.map((tag) => (
						<span
							key={tag.id}
							style={{
								padding: "0.25rem 0.75rem",
								borderRadius: "999px",
								background: "#f3f4f6",
								color: "#374151",
								fontSize: "0.85rem",
							}}
						>
							#{tag.name}
						</span>
					))}
				</div>
			)}

			{/* 좋아요 */}
			<div style={{ marginBottom: "2rem" }}>
				<button
					type="button"
					onClick={handleLikeToggle}
					disabled={isLiking}
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.4rem",
						padding: "0.5rem 1.25rem",
						borderRadius: "999px",
						border: `1px solid ${isLiked ? "#ec4899" : "#e5e7eb"}`,
						background: isLiked ? "#fdf2f8" : "#fff",
						color: isLiked ? "#ec4899" : "#374151",
						cursor: "pointer",
						fontSize: "0.95rem",
						fontWeight: "bold",
					}}
				>
					{isLiked ? "❤️" : "🤍"} {likeCount}
				</button>
			</div>

			<hr style={{ marginBottom: "1.5rem", borderColor: "#e5e7eb" }} />

			{/* 댓글 정렬 */}
			<div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
				{(["desc", "asc"] as const).map((o) => (
					<button
						key={o}
						type="button"
						onClick={() => setSearchParams({ order: o })}
						style={{
							padding: "0.3rem 0.75rem",
							borderRadius: "999px",
							border: `1px solid ${commentOrder === o ? "#000" : "#d1d5db"}`,
							background: commentOrder === o ? "#000" : "#fff",
							color: commentOrder === o ? "#fff" : "#000",
							cursor: "pointer",
							fontSize: "0.85rem",
						}}
					>
						{o === "desc" ? "최신순" : "오래된순"}
					</button>
				))}
			</div>

			{/* 댓글 입력 */}
			<div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
				<input
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleCommentSubmit();
					}}
					placeholder="댓글을 입력해주세요..."
					style={{
						flex: 1,
						padding: "0.6rem 1rem",
						borderRadius: "6px",
						border: "1px solid #d1d5db",
						fontSize: "0.9rem",
					}}
				/>
				<button
					type="button"
					onClick={handleCommentSubmit}
					disabled={!commentText.trim() || isSubmittingComment}
					style={{
						padding: "0.6rem 1.25rem",
						borderRadius: "6px",
						border: "none",
						background: commentText.trim() ? "#ec4899" : "#e5e7eb",
						color: commentText.trim() ? "#fff" : "#9ca3af",
						cursor: commentText.trim() ? "pointer" : "not-allowed",
					}}
				>
					{isSubmittingComment ? "등록 중..." : "등록"}
				</button>
			</div>

			{/* 댓글 초기 로딩 */}
			{isCommentsLoading &&
				Array.from({ length: 5 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: 스켈레톤은 순서 고정
					<SkeletonComment key={i} />
				))}

			{/* 댓글 목록 */}
			{commentsData?.pages
				.flatMap((page) => page.data)
				.map((comment) => (
					<div
						key={comment.id}
						style={{ padding: "1rem 0", borderBottom: "1px solid #f3f4f6" }}
					>
						<div
							style={{
								display: "flex",
								alignItems: "flex-start",
								justifyContent: "space-between",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "0.5rem",
									marginBottom: "0.4rem",
								}}
							>
								<AvatarCircle name={comment.author.name} size={28} />
								<span style={{ fontWeight: "bold", fontSize: "0.88rem" }}>
									{comment.author.name}
								</span>
								<span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
									{comment.createdAt?.slice(0, 10)}
								</span>
							</div>
							{me?.id === comment.author.id && (
								<button
									type="button"
									onClick={() => handleCommentDelete(comment.id)}
									style={{
										background: "none",
										border: "none",
										color: "#9ca3af",
										cursor: "pointer",
										fontSize: "0.8rem",
									}}
								>
									삭제
								</button>
							)}
						</div>
						<div
							style={{
								color: "#374151",
								fontSize: "0.9rem",
								paddingLeft: "2.25rem",
							}}
						>
							{comment.content}
						</div>
					</div>
				))}

			{/* 추가 로딩 스켈레톤 */}
			{isFetchingNextPage &&
				Array.from({ length: 3 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: 스켈레톤은 순서 고정
					<SkeletonComment key={i} />
				))}

			<div ref={sentinelRef} style={{ height: 1 }} />
		</div>
	);
}
