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

	const linkStyle = ({ isActive }: { isActive: boolean }) =>
		`flex items-center gap-2 px-4 py-[0.6rem] rounded-md no-underline text-[0.95rem] ${
			isActive
				? "text-pink-500 font-bold bg-[#fdf2f8]"
				: "text-gray-700 font-normal"
		}`;

	return (
		<>
			{/* 모바일 오버레이 */}
			{isMobile && isOpen && (
				<button
					type="button"
					onClick={onClose}
					aria-label="사이드바 닫기"
					className="fixed inset-0 bg-black/30 z-[8] top-[60px] border-0 cursor-default p-0"
				/>
			)}

			<aside
				className={`w-[200px] min-h-[calc(100vh-60px)] border-r border-gray-200 py-5 px-3 bg-white shrink-0 flex flex-col justify-between ${
					isMobile
						? `fixed top-[60px] left-0 z-[9] transition-transform duration-[250ms] ease-in-out ${
								isOpen
									? "translate-x-0 shadow-[4px_0_12px_rgba(0,0,0,0.15)]"
									: "-translate-x-full"
							}`
						: ""
				}`}
			>
				<nav className="flex flex-col gap-1">
					<NavLink to="/" className={linkStyle} end>
						🔍 찾기
					</NavLink>
					<NavLink to="/my" className={linkStyle}>
						👤 마이페이지
					</NavLink>
				</nav>

				{/* 탈퇴하기 버튼 */}
				<button
					type="button"
					onClick={() => setShowModal(true)}
					className="bg-transparent border-0 text-gray-400 cursor-pointer text-[0.85rem] text-left px-4 py-[0.6rem]"
				>
					일시탈퇴
				</button>
			</aside>

			{/* 탈퇴 확인 모달 */}
			{showModal && (
				<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]">
					<div className="bg-[#1c1c1e] rounded-2xl p-8 w-full max-w-[320px] flex flex-col items-center gap-6 relative">
						{/* 닫기 */}
						<button
							type="button"
							onClick={() => setShowModal(false)}
							className="absolute top-4 right-4 bg-transparent border-0 text-white text-[1.1rem] cursor-pointer"
						>
							✕
						</button>

						<p className="text-white text-base font-bold m-0 text-center">
							정말 탈퇴하시겠습니까?
						</p>

						<div className="flex gap-3 w-full">
							<button
								type="button"
								onClick={() => setShowModal(false)}
								className="flex-1 py-[0.7rem] rounded-lg border border-[#3a3a3c] bg-transparent text-white cursor-pointer text-[0.95rem]"
							>
								아니오
							</button>
							<button
								type="button"
								onClick={() => withdraw()}
								disabled={isPending}
								className={`flex-1 py-[0.7rem] rounded-lg border-0 bg-pink-500 text-white text-[0.95rem] font-bold ${isPending ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
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
