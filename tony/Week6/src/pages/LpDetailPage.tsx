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
		className="rounded-full overflow-hidden shrink-0 bg-pink-500 flex items-center justify-center"
		style={{ width: size, height: size }}
	>
		{avatar ? (
			<img src={avatar} alt={name} className="w-full h-full object-cover" />
		) : (
			<span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
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
		mutationFn: ({
			commentId,
			content,
		}: {
			commentId: number;
			content: string;
		}) => updateComment(id, commentId, content),
		onSuccess: () => {
			setEditingCommentId(null);
			queryClient.invalidateQueries({ queryKey: ["lpComments", id] });
		},
	});

	const { mutate: toggleLike, isPending: isLiking } = useMutation({
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
		return <div className="p-12 text-center text-gray-500">로딩 중...</div>;

	if (isError)
		return (
			<div className="p-12 text-center">
				<p className="text-red-500 mb-4">불러오지 못했어요.</p>
				<button
					type="button"
					onClick={() => refetch()}
					className="px-6 py-2 rounded-md border border-gray-300 cursor-pointer"
				>
					다시 시도
				</button>
			</div>
		);

	return (
		<div className="max-w-[680px] mx-auto">
			{/* 수정 모달 */}
			{showEditModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
					<div className="bg-[#1c1c1e] rounded-2xl p-8 w-[90%] max-w-[380px] flex flex-col gap-4 relative">
						{/* 닫기 */}
						<button
							type="button"
							onClick={() => setShowEditModal(false)}
							className="absolute top-4 right-4 bg-transparent border-0 text-white text-[1.2rem] cursor-pointer"
						>
							✕
						</button>

						{/* 이미지 (클릭 시 파일 선택) */}
						{/* biome-ignore lint/a11y/noStaticElementInteractions: 파일 선택 트리거 */}
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: 파일 선택 트리거 */}
						<div
							className={`flex justify-center ${isEditUploading ? "cursor-wait" : "cursor-pointer"}`}
							onClick={() =>
								!isEditUploading && editFileInputRef.current?.click()
							}
						>
							<div className="relative w-50 h-50">
								<img
									src={editPreviewUrl ?? editThumbnail ?? ""}
									alt="thumbnail"
									className={`w-50 h-50 rounded-full object-cover bg-[#3a3a3c] ${isEditUploading ? "opacity-50" : "opacity-100"}`}
								/>
								{isEditUploading && (
									<div className="absolute inset-0 flex items-center justify-center text-white text-[0.85rem]">
										업로드 중...
									</div>
								)}
							</div>
							<input
								ref={editFileInputRef}
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleEditImageChange}
							/>
						</div>

						{/* 제목 */}
						<input
							value={editTitle}
							onChange={(e) => setEditTitle(e.target.value)}
							placeholder="제목"
							className="px-4 py-3 rounded-lg border border-[#3a3a3c] bg-[#2c2c2e] text-white text-[0.95rem] outline-none"
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
							className={`py-[0.8rem] rounded-lg border-0 bg-pink-500 text-white font-bold ${isUpdating || isEditUploading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
						>
							{isUpdating ? "저장 중..." : "저장"}
						</button>
					</div>
				</div>
			)}

			{/* 작성자 정보 + 날짜 */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-[0.6rem]">
					<AvatarCircle
						name={lp?.author.name ?? ""}
						avatar={lp?.author.avatar}
					/>
					<span className="font-bold text-[0.95rem]">{lp?.author.name}</span>
				</div>
				<span className="text-gray-400 text-[0.85rem]">
					{lp?.createdAt ? formatRelativeDate(lp.createdAt) : ""}
				</span>
			</div>

			{/* 제목 + 수정/삭제 */}
			<div className="flex items-center justify-between mb-5">
				<h1 className="text-[1.6rem] font-bold m-0">{lp?.title}</h1>
				{isAuthor && (
					<div className="flex gap-2">
						<button
							type="button"
							onClick={handleEditOpen}
							className="bg-transparent border-0 cursor-pointer text-[1.1rem] text-gray-500"
							title="수정"
						>
							✏️
						</button>
						<button
							type="button"
							onClick={handleDelete}
							disabled={isDeleting}
							className="bg-transparent border-0 cursor-pointer text-[1.1rem] text-gray-500"
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
					className="w-full aspect-square object-cover rounded-xl mb-6 block"
				/>
			)}

			{/* 본문 */}
			<p className="leading-[1.8] text-gray-700 mb-6 text-[0.95rem]">
				{lp?.content}
			</p>

			{/* 태그 */}
			{lp?.tags && lp.tags.length > 0 && (
				<div className="flex flex-wrap gap-[0.4rem] mb-6">
					{lp.tags.map((tag) => (
						<span
							key={tag.id}
							className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[0.85rem]"
						>
							#{tag.name}
						</span>
					))}
				</div>
			)}

			{/* 좋아요 */}
			<div className="mb-8">
				<button
					type="button"
					onClick={() => toggleLike(isLiked)}
					disabled={isLiking}
					className={`flex items-center gap-[0.4rem] px-5 py-2 rounded-full border font-bold text-[0.95rem] cursor-pointer ${
						isLiked
							? "border-pink-500 bg-[#fdf2f8] text-pink-500"
							: "border-gray-200 bg-white text-gray-700"
					}`}
				>
					{isLiked ? "❤️" : "🤍"} {likeCount}
				</button>
			</div>

			<hr className="mb-6 border-gray-200" />

			{/* 댓글 정렬 */}
			<div className="flex gap-2 mb-4">
				{(["desc", "asc"] as const).map((o) => (
					<button
						key={o}
						type="button"
						onClick={() => setSearchParams({ order: o })}
						className={`px-3 py-[0.3rem] rounded-full border cursor-pointer text-[0.85rem] ${
							commentOrder === o
								? "border-black bg-black text-white"
								: "border-gray-300 bg-white text-black"
						}`}
					>
						{o === "desc" ? "최신순" : "오래된순"}
					</button>
				))}
			</div>

			{/* 댓글 입력 */}
			<div className="flex gap-2 mb-6">
				<input
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && commentText.trim())
							submitComment(commentText.trim());
					}}
					placeholder="댓글을 입력해주세요..."
					className="flex-1 px-4 py-[0.6rem] rounded-md border border-gray-300 text-[0.9rem]"
				/>
				<button
					type="button"
					onClick={() => {
						if (commentText.trim()) submitComment(commentText.trim());
					}}
					disabled={!commentText.trim() || isSubmitting}
					className={`px-5 py-[0.6rem] rounded-md border-0 ${commentText.trim() ? "bg-pink-500 text-white cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
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
							className="py-4 border-b border-gray-100 relative"
						>
							{/* 헤더: 아바타 + 이름 + 날짜 + ... 메뉴 */}
							<div className="flex items-center justify-between mb-[0.4rem]">
								<div className="flex items-center gap-2">
									<AvatarCircle name={comment.author.name} size={28} />
									<span className="font-bold text-[0.88rem]">
										{comment.author.name}
									</span>
									<span className="text-gray-400 text-[0.8rem]">
										{comment.createdAt?.slice(0, 10)}
									</span>
								</div>
								{isOwn && (
									<div className="relative">
										<button
											type="button"
											onClick={() =>
												setOpenMenuId(isMenuOpen ? null : comment.id)
											}
											className="bg-transparent border-0 cursor-pointer text-gray-400 text-[1.1rem] px-[0.4rem] py-[0.2rem] leading-none"
										>
											···
										</button>
										{isMenuOpen && (
											<div className="absolute right-0 top-full bg-white border border-gray-200 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-10 min-w-[80px] overflow-hidden">
												<button
													type="button"
													onClick={() => {
														setEditingCommentId(comment.id);
														setEditingText(comment.content);
														setOpenMenuId(null);
													}}
													className="block w-full px-4 py-2 bg-transparent border-0 cursor-pointer text-left text-[0.88rem] text-[#111]"
												>
													수정
												</button>
												<button
													type="button"
													onClick={() => {
														removeComment(comment.id);
														setOpenMenuId(null);
													}}
													className="block w-full px-4 py-2 bg-transparent border-0 cursor-pointer text-left text-[0.88rem] text-red-500"
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
								<div className="flex gap-2 pl-9">
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
										className="flex-1 px-3 py-[0.4rem] rounded-md border border-gray-300 text-[0.9rem]"
									/>
									<button
										type="button"
										onClick={() =>
											editComment({
												commentId: comment.id,
												content: editingText.trim(),
											})
										}
										className="bg-transparent border-0 cursor-pointer text-pink-500 text-[1.2rem] px-1"
									>
										✓
									</button>
								</div>
							) : (
								<div className="text-gray-700 text-[0.9rem] pl-9">
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

			<div ref={sentinelRef} className="h-px" />
		</div>
	);
}
