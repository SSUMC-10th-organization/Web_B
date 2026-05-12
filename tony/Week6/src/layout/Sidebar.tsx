import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { deleteMyAccount } from "../apis/user";
import { tokenStorage } from "../lib/tokenStorage";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const { mutate: withdraw, isPending } = useMutation({
		mutationFn: deleteMyAccount,
		onSuccess: () => {
			queryClient.clear();
			tokenStorage.clearTokens();
			navigate("/login", { replace: true });
		},
	});

	const linkStyle = ({ isActive }: { isActive: boolean }) => ({
		display: "flex",
		alignItems: "center",
		gap: "0.5rem",
		padding: "0.6rem 1rem",
		borderRadius: "6px",
		textDecoration: "none",
		color: isActive ? "#ec4899" : "#374151",
		fontWeight: isActive ? ("bold" as const) : ("normal" as const),
		backgroundColor: isActive ? "#fdf2f8" : "transparent",
		fontSize: "0.95rem",
	});

	return (
		<>
			{/* 모바일 오버레이 */}
			{isMobile && isOpen && (
				<button
					type="button"
					onClick={onClose}
					aria-label="사이드바 닫기"
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(0,0,0,0.3)",
						zIndex: 8,
						top: "60px",
						border: "none",
						cursor: "default",
						padding: 0,
					}}
				/>
			)}

			<aside
				style={{
					width: "200px",
					minHeight: "calc(100vh - 60px)",
					borderRight: "1px solid #e5e7eb",
					padding: "1.25rem 0.75rem",
					backgroundColor: "#fff",
					flexShrink: 0,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					...(isMobile
						? {
								position: "fixed" as const,
								top: "60px",
								left: 0,
								zIndex: 9,
								transform: isOpen ? "translateX(0)" : "translateX(-100%)",
								transition: "transform 0.25s ease",
								boxShadow: isOpen ? "4px 0 12px rgba(0,0,0,0.15)" : "none",
							}
						: {}),
				}}
			>
				<nav
					style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
				>
					<NavLink to="/" style={linkStyle} end>
						🔍 찾기
					</NavLink>
					<NavLink to="/my" style={linkStyle}>
						👤 마이페이지
					</NavLink>
				</nav>

				{/* 탈퇴하기 버튼 */}
				<button
					type="button"
					onClick={() => setShowModal(true)}
					style={{
						background: "none",
						border: "none",
						color: "#9ca3af",
						cursor: "pointer",
						fontSize: "0.85rem",
						textAlign: "left",
						padding: "0.6rem 1rem",
					}}
				>
					일시탈퇴
				</button>
			</aside>

			{/* 탈퇴 확인 모달 */}
			{showModal && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(0,0,0,0.7)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 1000,
					}}
				>
					<div
						style={{
							background: "#1c1c1e",
							borderRadius: "16px",
							padding: "2rem",
							width: "100%",
							maxWidth: "320px",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "1.5rem",
							position: "relative",
						}}
					>
						{/* 닫기 */}
						<button
							type="button"
							onClick={() => setShowModal(false)}
							style={{
								position: "absolute",
								top: "1rem",
								right: "1rem",
								background: "none",
								border: "none",
								color: "#fff",
								fontSize: "1.1rem",
								cursor: "pointer",
							}}
						>
							✕
						</button>

						<p
							style={{
								color: "#fff",
								fontSize: "1rem",
								fontWeight: "bold",
								margin: 0,
								textAlign: "center",
							}}
						>
							정말 탈퇴하시겠습니까?
						</p>

						<div style={{ display: "flex", gap: "0.75rem", width: "100%" }}>
							<button
								type="button"
								onClick={() => setShowModal(false)}
								style={{
									flex: 1,
									padding: "0.7rem",
									borderRadius: "8px",
									border: "1px solid #3a3a3c",
									background: "none",
									color: "#fff",
									cursor: "pointer",
									fontSize: "0.95rem",
								}}
							>
								아니오
							</button>
							<button
								type="button"
								onClick={() => withdraw()}
								disabled={isPending}
								style={{
									flex: 1,
									padding: "0.7rem",
									borderRadius: "8px",
									border: "none",
									background: "#ec4899",
									color: "#fff",
									cursor: isPending ? "not-allowed" : "pointer",
									fontSize: "0.95rem",
									fontWeight: "bold",
									opacity: isPending ? 0.7 : 1,
								}}
							>
								{isPending ? "탈퇴 중..." : "예"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
