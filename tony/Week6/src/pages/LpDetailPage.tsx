import {
	useInfiniteQuery,
	useMutation,
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
	updateComment,
	updateLp,
	uploadImage,
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
	const [openMenuId, setOpenMenuId] = useState<number | null>(null);
	const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
	const [editingText, setEditingText] = useState("");
	const sentinelRef = useRef<HTMLDivElement>(null);
	const editFileInputRef = useRef<HTMLInputElement>(null);

	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(0);

	const [showEditModal, setShowEditModal] = useState(false);
	const [editTitle, setEditTitle] = useState("");
	const [editThumbnail, setEditThumbnail] = useState("");
	const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
	const [isEditUploading, setIsEditUploading] = useState(false);
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
		if (lp) {
			setLikeCount(lp.likes?.length ?? 0);
			setIsLiked(lp.likes?.some((l) => l.userId === me?.id) ?? false);
		}
	}, [lp, me]);

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

	const { mutate: submitComment, isPending: isSubmitting } = useMutation({
		mutationFn: (text: string) => postComment(id, text),
		onSuccess: () => {
			setCommentText("");
			queryClient.invalidateQueries({ queryKey: ["lpComments", id] });
		},
	});

	const { mutate: removeComment } = useMutation({
		mutationFn: (commentId: number) => deleteComment(id, commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lpComments", id] });
		},
	});

	const { mutate: editComment } = useMutation({
		mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
			updateComment(id, commentId, content),
		onSuccess: () => {
			setEditingCommentId(null);
			queryClient.invalidateQueries({ queryKey: ["lpComments", id] });
		},
	});

	const { mutate: toggleLike, isPending: isLiking } = useMutation({
		// 현재 liked 상태를 인자로 받아 클로저 의존 제거
		mutationFn: (currentlyLiked: boolean) =>
			currentlyLiked ? deleteLike(id) : postLike(id),
		onMutate: (currentlyLiked) => {
			const prevCount = likeCount ?? 0;
			setIsLiked(!currentlyLiked);
			setLikeCount(currentlyLiked ? prevCount - 1 : prevCount + 1);
			return { wasLiked: currentlyLiked, prevCount };
		},
		onError: (_, __, context) => {
			if (context) {
				setIsLiked(context.wasLiked);
				setLikeCount(context.prevCount);
			}
		},
		onSuccess: () => {
			// 서버 진짜 값으로 동기화
			queryClient.invalidateQueries({ queryKey: ["lp", id] });
		},
	});

	const { mutate: saveEdit, isPending: isUpdating } = useMutation({
		mutationFn: (body: { title?: string; thumbnail?: string }) =>
			updateLp(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lp", id] });
			setShowEditModal(false);
			setEditPreviewUrl(null);
		},
	});

	const handleEditOpen = () => {
		if (!lp) return;
		setEditTitle(lp.title);
		setEditThumbnail(lp.thumbnail ?? "");
		setEditPreviewUrl(null);
		setShowEditModal(true);
	};

	const handleEditImageChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setEditPreviewUrl(URL.createObjectURL(file));
		setIsEditUploading(true);
		try {
			const imageUrl = await uploadImage(file);
			setEditThumbnail(imageUrl);
		} finally {
			setIsEditUploading(false);
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
							background: "#1c1c1e",
							borderRadius: "16px",
							padding: "2rem",
							width: "90%",
							maxWidth: "380px",
							display: "flex",
							flexDirection: "column",
							gap: "1rem",
							position: "relative",
						}}
					>
						{/* 닫기 */}
						<button
							type="button"
							onClick={() => setShowEditModal(false)}
							style={{
								position: "absolute",
								top: "1rem",
								right: "1rem",
								background: "none",
								border: "none",
								color: "#fff",
								fontSize: "1.2rem",
								cursor: "pointer",
							}}
						>
							✕
						</button>

						{/* 이미지 (클릭 시 파일 선택) */}
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								cursor: isEditUploading ? "wait" : "pointer",
							}}
							onClick={() =>
								!isEditUploading && editFileInputRef.current?.click()
							}
						>
							<div style={{ position: "relative", width: "200px", height: "200px" }}>
								<img
									src={editPreviewUrl ?? editThumbnail ?? ""}
									alt="thumbnail"
									style={{
										width: "200px",
										height: "200px",
										borderRadius: "50%",
										objectFit: "cover",
										opacity: isEditUploading ? 0.5 : 1,
										background: "#3a3a3c",
									}}
								/>
								{isEditUploading && (
									<div
										style={{
											position: "absolute",
											inset: 0,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "#fff",
											fontSize: "0.85rem",
										}}
									>
										업로드 중...
									</div>
								)}
							</div>
							<input
								ref={editFileInputRef}
								type="file"
								accept="image/*"
								style={{ display: "none" }}
								onChange={handleEditImageChange}
							/>
						</div>

						{/* 제목 */}
						<input
							value={editTitle}
							onChange={(e) => setEditTitle(e.target.value)}
							placeholder="제목"
							style={{
								padding: "0.75rem 1rem",
								borderRadius: "8px",
								border: "1px solid #3a3a3c",
								background: "#2c2c2e",
								color: "#fff",
								fontSize: "0.95rem",
								outline: "none",
							}}
						/>

						{/* 저장 버튼 */}
						<button
							type="button"
							onClick={() =>
								saveEdit({
									title: editTitle,
									thumbnail: editThumbnail || undefined,
								})
							}
							disabled={isUpdating || isEditUploading}
							style={{
								padding: "0.8rem",
								borderRadius: "8px",
								border: "none",
								background: "#ec4899",
								color: "#fff",
								fontWeight: "bold",
								cursor: isUpdating || isEditUploading ? "not-allowed" : "pointer",
								opacity: isUpdating || isEditUploading ? 0.7 : 1,
							}}
						>
							{isUpdating ? "저장 중..." : "저장"}
						</button>
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
					onClick={() => toggleLike(isLiked)}
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
						if (e.key === "Enter" && commentText.trim())
							submitComment(commentText.trim());
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
					onClick={() => {
						if (commentText.trim()) submitComment(commentText.trim());
					}}
					disabled={!commentText.trim() || isSubmitting}
					style={{
						padding: "0.6rem 1.25rem",
						borderRadius: "6px",
						border: "none",
						background: commentText.trim() ? "#ec4899" : "#e5e7eb",
						color: commentText.trim() ? "#fff" : "#9ca3af",
						cursor: commentText.trim() ? "pointer" : "not-allowed",
					}}
				>
					{isSubmitting ? "등록 중..." : "작성"}
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
				.map((comment) => {
					const isOwn = me?.id === comment.author.id;
					const isEditing = editingCommentId === comment.id;
					const isMenuOpen = openMenuId === comment.id;

					return (
						<div
							key={comment.id}
							style={{
								padding: "1rem 0",
								borderBottom: "1px solid #f3f4f6",
								position: "relative",
							}}
						>
							{/* 헤더: 아바타 + 이름 + 날짜 + ... 메뉴 */}
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									marginBottom: "0.4rem",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.5rem",
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
								{isOwn && (
									<div style={{ position: "relative" }}>
										<button
											type="button"
											onClick={() =>
												setOpenMenuId(isMenuOpen ? null : comment.id)
											}
											style={{
												background: "none",
												border: "none",
												cursor: "pointer",
												color: "#9ca3af",
												fontSize: "1.1rem",
												padding: "0.2rem 0.4rem",
												lineHeight: 1,
											}}
										>
											···
										</button>
										{isMenuOpen && (
											<div
												style={{
													position: "absolute",
													right: 0,
													top: "100%",
													background: "#fff",
													border: "1px solid #e5e7eb",
													borderRadius: "8px",
													boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
													zIndex: 10,
													minWidth: "80px",
													overflow: "hidden",
												}}
											>
												<button
													type="button"
													onClick={() => {
														setEditingCommentId(comment.id);
														setEditingText(comment.content);
														setOpenMenuId(null);
													}}
													style={{
														display: "block",
														width: "100%",
														padding: "0.5rem 1rem",
														background: "none",
														border: "none",
														cursor: "pointer",
														textAlign: "left",
														fontSize: "0.88rem",
														color: "#111",
													}}
												>
													수정
												</button>
												<button
													type="button"
													onClick={() => {
														removeComment(comment.id);
														setOpenMenuId(null);
													}}
													style={{
														display: "block",
														width: "100%",
														padding: "0.5rem 1rem",
														background: "none",
														border: "none",
														cursor: "pointer",
														textAlign: "left",
														fontSize: "0.88rem",
														color: "#ef4444",
													}}
												>
													삭제
												</button>
											</div>
										)}
									</div>
								)}
							</div>

							{/* 댓글 내용 or 인라인 수정 */}
							{isEditing ? (
								<div
									style={{
										display: "flex",
										gap: "0.5rem",
										paddingLeft: "2.25rem",
									}}
								>
									<input
										// biome-ignore lint/a11y/noAutofocus: 수정 모드 진입 시 포커스
										autoFocus
										value={editingText}
										onChange={(e) => setEditingText(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter" && editingText.trim())
												editComment({
													commentId: comment.id,
													content: editingText.trim(),
												});
											if (e.key === "Escape") setEditingCommentId(null);
										}}
										style={{
											flex: 1,
											padding: "0.4rem 0.75rem",
											borderRadius: "6px",
											border: "1px solid #d1d5db",
											fontSize: "0.9rem",
										}}
									/>
									<button
										type="button"
										onClick={() =>
											editComment({
												commentId: comment.id,
												content: editingText.trim(),
											})
										}
										style={{
											background: "none",
											border: "none",
											cursor: "pointer",
											color: "#ec4899",
											fontSize: "1.2rem",
											padding: "0 0.25rem",
										}}
									>
										✓
									</button>
								</div>
							) : (
								<div
									style={{
										color: "#374151",
										fontSize: "0.9rem",
										paddingLeft: "2.25rem",
									}}
								>
									{comment.content}
								</div>
							)}
						</div>
					);
				})}

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
