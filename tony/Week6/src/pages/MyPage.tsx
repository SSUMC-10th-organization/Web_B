import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyLikedLps, getMyLps } from "../apis/lp";
import { getMyProfile, type User, updateMyProfile } from "../apis/user";
import LpCard from "../components/LpCard";
import { tokenStorage } from "../lib/tokenStorage";

type Tab = "liked" | "mine";
type Order = "asc" | "desc";

export default function MyPage() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const isLoggedIn = !!tokenStorage.getAccessToken();

	const [showEdit, setShowEdit] = useState(false);
	const [editName, setEditName] = useState("");
	const [editBio, setEditBio] = useState("");
	const [activeTab, setActiveTab] = useState<Tab>("liked");
	const [order, setOrder] = useState<Order>("desc");

	useEffect(() => {
		if (!isLoggedIn) navigate("/login", { replace: true });
	}, [isLoggedIn, navigate]);

	const { data: me } = useQuery({
		queryKey: ["me"],
		queryFn: getMyProfile,
		staleTime: 1000 * 60 * 5,
	});

	const { data: likedData } = useQuery({
		queryKey: ["myLikedLps", order],
		queryFn: () => getMyLikedLps(undefined, 50, order),
		enabled: activeTab === "liked",
	});

	const { data: mineData } = useQuery({
		queryKey: ["myLps", order],
		queryFn: () => getMyLps(undefined, 50, order),
		enabled: activeTab === "mine",
	});

	const { mutate: saveProfile, isPending } = useMutation({
		mutationFn: updateMyProfile,
		onMutate: async (newData) => {
			await queryClient.cancelQueries({ queryKey: ["me"] });
			const previous = queryClient.getQueryData<User>(["me"]);
			queryClient.setQueryData<User>(["me"], (old) =>
				old
					? {
							...old,
							name: newData.name ?? old.name,
							bio: newData.bio !== undefined ? newData.bio : old.bio,
						}
					: old,
			);
			setShowEdit(false);
			return { previous };
		},
		onError: (_, __, context) => {
			queryClient.setQueryData(["me"], context?.previous);
			setShowEdit(true);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["me"] });
		},
	});

	const openEdit = () => {
		setEditName(me?.name ?? "");
		setEditBio(me?.bio ?? "");
		setShowEdit(true);
	};

	const lps = activeTab === "liked" ? likedData?.data : mineData?.data;

	if (!isLoggedIn) return null;

	return (
		<div className="min-h-screen bg-black text-white pb-12">
			{/* 프로필 섹션 */}
			<div className="max-w-200 mx-auto px-6 pt-10 flex items-center gap-8 relative">
				{/* 아바타 */}
				<div className="w-25 h-25 rounded-full overflow-hidden bg-gray-700 shrink-0 flex items-center justify-center">
					{me?.avatar ? (
						<img
							src={me.avatar}
							alt={me.name}
							className="w-full h-full object-cover"
						/>
					) : (
						<svg
							width="52"
							height="52"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#9ca3af"
							strokeWidth="1.2"
						>
							<title>프로필</title>
							<circle cx="12" cy="8" r="4" />
							<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
						</svg>
					)}
				</div>

				{/* 이름 / bio / email */}
				{showEdit ? (
					<div className="flex flex-col gap-[0.6rem] flex-1">
						<div className="flex items-center gap-2">
							<input
								// biome-ignore lint/a11y/noAutofocus: 편집 모드 진입 시 포커스
								autoFocus
								value={editName}
								onChange={(e) => setEditName(e.target.value)}
								className="bg-transparent border border-gray-600 rounded-md text-white px-3 py-[0.4rem] text-base w-50 outline-none"
							/>
							<button
								type="button"
								disabled={isPending}
								onClick={() =>
									saveProfile({
										name: editName || undefined,
										bio: editBio || undefined,
									})
								}
								className={`bg-transparent border-0 text-green-400 text-[1.3rem] ${isPending ? "cursor-wait" : "cursor-pointer"}`}
							>
								✓
							</button>
						</div>
						<input
							value={editBio}
							onChange={(e) => setEditBio(e.target.value)}
							placeholder="Bio (선택)"
							className="bg-transparent border border-gray-600 rounded-md text-white px-3 py-[0.4rem] text-[0.9rem] w-50 outline-none"
						/>
						<span className="text-gray-500 text-[0.85rem]">{me?.email}</span>
					</div>
				) : (
					<div className="flex flex-col gap-[0.3rem] flex-1">
						<span className="font-bold text-[1.3rem]">{me?.name}</span>
						{me?.bio && (
							<span className="text-gray-400 text-[0.9rem]">{me.bio}</span>
						)}
						<span className="text-gray-500 text-[0.85rem]">{me?.email}</span>
					</div>
				)}

				{/* 설정 아이콘 */}
				{!showEdit && (
					<button
						type="button"
						onClick={openEdit}
						className="absolute top-10 right-6 bg-transparent border-0 text-gray-400 text-[1.2rem] cursor-pointer"
					>
						⚙️
					</button>
				)}
			</div>

			{/* 구분선 */}
			<div className="max-w-200 mx-auto mt-6 border-b border-gray-700" />

			{/* 탭 */}
			<div className="max-w-200 mx-auto flex border-b border-gray-800">
				{(
					[
						{ key: "liked", label: "내가 좋아요 한 LP" },
						{ key: "mine", label: "내가 작성한 LP" },
					] as const
				).map(({ key, label }) => (
					<button
						key={key}
						type="button"
						onClick={() => setActiveTab(key)}
						className={`flex-1 py-[0.9rem] bg-transparent border-0 cursor-pointer text-[0.95rem] -mb-px ${
							activeTab === key
								? "text-white font-bold border-b-2 border-white"
								: "text-gray-500 font-normal border-b-2 border-transparent"
						}`}
					>
						{label}
					</button>
				))}
			</div>

			{/* 정렬 + LP 그리드 */}
			<div className="max-w-200 mx-auto mt-6 px-6">
				{/* 정렬 버튼 */}
				<div className="flex justify-end gap-2 mb-4">
					{(["asc", "desc"] as const).map((o) => (
						<button
							key={o}
							type="button"
							onClick={() => setOrder(o)}
							className={`px-[0.9rem] py-[0.35rem] rounded-md border cursor-pointer text-[0.85rem] ${
								order === o
									? "border-white bg-white text-black font-bold"
									: "border-gray-600 bg-transparent text-gray-400 font-normal"
							}`}
						>
							{o === "asc" ? "오래된순" : "최신순"}
						</button>
					))}
				</div>

				{/* LP 그리드 */}
				{lps && lps.length > 0 ? (
					<div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
						{lps.map((lp) => (
							<LpCard key={lp.id} lp={lp} />
						))}
					</div>
				) : (
					<div className="text-center text-gray-500 py-16 text-[0.95rem]">
						{activeTab === "liked"
							? "좋아요한 LP가 없어요."
							: "작성한 LP가 없어요."}
					</div>
				)}
			</div>
		</div>
	);
}
