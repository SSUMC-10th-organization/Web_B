import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyLikedLps, getMyLps } from "../apis/lp";
import { type User, getMyProfile, updateMyProfile } from "../apis/user";
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

	if (!isLoggedIn) {
		navigate("/login", { replace: true });
		return null;
	}

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

	// 닉네임 optimistic update
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
			return { previous };
		},
		onError: (_, __, context) => {
			queryClient.setQueryData(["me"], context?.previous);
		},
		onSuccess: () => setShowEdit(false),
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

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#000",
				color: "#fff",
				paddingBottom: "3rem",
			}}
		>
			{/* 프로필 섹션 */}
			<div
				style={{
					maxWidth: "800px",
					margin: "0 auto",
					padding: "2.5rem 1.5rem 0",
					display: "flex",
					alignItems: "center",
					gap: "2rem",
					position: "relative",
				}}
			>
				{/* 아바타 */}
				<div
					style={{
						width: "100px",
						height: "100px",
						borderRadius: "50%",
						overflow: "hidden",
						background: "#374151",
						flexShrink: 0,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{me?.avatar ? (
						<img
							src={me.avatar}
							alt={me.name}
							style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
					<div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
						<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
							<input
								// biome-ignore lint/a11y/noAutofocus: 편집 모드 진입 시 포커스
								autoFocus
								value={editName}
								onChange={(e) => setEditName(e.target.value)}
								style={{
									background: "transparent",
									border: "1px solid #4b5563",
									borderRadius: "6px",
									color: "#fff",
									padding: "0.4rem 0.75rem",
									fontSize: "1rem",
									width: "200px",
									outline: "none",
								}}
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
								style={{
									background: "none",
									border: "none",
									color: "#4ade80",
									fontSize: "1.3rem",
									cursor: isPending ? "wait" : "pointer",
								}}
							>
								✓
							</button>
						</div>
						<input
							value={editBio}
							onChange={(e) => setEditBio(e.target.value)}
							placeholder="Bio (선택)"
							style={{
								background: "transparent",
								border: "1px solid #4b5563",
								borderRadius: "6px",
								color: "#fff",
								padding: "0.4rem 0.75rem",
								fontSize: "0.9rem",
								width: "200px",
								outline: "none",
							}}
						/>
						<span style={{ color: "#6b7280", fontSize: "0.85rem" }}>
							{me?.email}
						</span>
					</div>
				) : (
					<div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", flex: 1 }}>
						<span style={{ fontWeight: "bold", fontSize: "1.3rem" }}>
							{me?.name}
						</span>
						{me?.bio && (
							<span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>{me.bio}</span>
						)}
						<span style={{ color: "#6b7280", fontSize: "0.85rem" }}>{me?.email}</span>
					</div>
				)}

				{/* 설정 아이콘 */}
				{!showEdit && (
					<button
						type="button"
						onClick={openEdit}
						style={{
							position: "absolute",
							top: "2.5rem",
							right: "1.5rem",
							background: "none",
							border: "none",
							color: "#9ca3af",
							fontSize: "1.2rem",
							cursor: "pointer",
						}}
					>
						⚙️
					</button>
				)}
			</div>

			{/* 구분선 */}
			<div
				style={{
					maxWidth: "800px",
					margin: "1.5rem auto 0",
					borderBottom: "1px solid #374151",
				}}
			/>

			{/* 탭 */}
			<div
				style={{
					maxWidth: "800px",
					margin: "0 auto",
					display: "flex",
					borderBottom: "1px solid #1f2937",
				}}
			>
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
						style={{
							flex: 1,
							padding: "0.9rem 0",
							background: "none",
							border: "none",
							cursor: "pointer",
							color: activeTab === key ? "#fff" : "#6b7280",
							fontWeight: activeTab === key ? "bold" : "normal",
							fontSize: "0.95rem",
							borderBottom: activeTab === key ? "2px solid #fff" : "2px solid transparent",
							marginBottom: "-1px",
						}}
					>
						{label}
					</button>
				))}
			</div>

			{/* 정렬 + LP 그리드 */}
			<div
				style={{
					maxWidth: "800px",
					margin: "1.5rem auto 0",
					padding: "0 1.5rem",
				}}
			>
				{/* 정렬 버튼 */}
				<div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginBottom: "1rem" }}>
					{(["asc", "desc"] as const).map((o) => (
						<button
							key={o}
							type="button"
							onClick={() => setOrder(o)}
							style={{
								padding: "0.35rem 0.9rem",
								borderRadius: "6px",
								border: `1px solid ${order === o ? "#fff" : "#4b5563"}`,
								background: order === o ? "#fff" : "transparent",
								color: order === o ? "#000" : "#9ca3af",
								cursor: "pointer",
								fontSize: "0.85rem",
								fontWeight: order === o ? "bold" : "normal",
							}}
						>
							{o === "asc" ? "오래된순" : "최신순"}
						</button>
					))}
				</div>

				{/* LP 그리드 */}
				{lps && lps.length > 0 ? (
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
							gap: "0.75rem",
						}}
					>
						{lps.map((lp) => (
							<LpCard key={lp.id} lp={lp} />
						))}
					</div>
				) : (
					<div
						style={{
							textAlign: "center",
							color: "#6b7280",
							padding: "4rem 0",
							fontSize: "0.95rem",
						}}
					>
						{activeTab === "liked" ? "좋아요한 LP가 없어요." : "작성한 LP가 없어요."}
					</div>
				)}
			</div>
		</div>
	);
}
