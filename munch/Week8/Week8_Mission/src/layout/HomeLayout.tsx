import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { deleteUser } from "../apis/auth";
import ConfirmModal from "../components/ConfirmModal";
import Footer from "../components/Footer";
import LpCreateModal from "../components/LpCreateModal";
import Navbar from "../components/Navbar";
import SearchPanel from "../components/SearchPanel";
import { toast } from "../components/Toast";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import useSidebar from "../hooks/useSideBar";

const HomeLayout = () => {
	const {
		isOpen: isSidebarOpen,
		close: closeSidebar,
		toggle: toggleSidebar,
	} = useSidebar();
	const [isLpModalOpen, setIsLpModalOpen] = useState(false);
	const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const { accessToken } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { removeItem: removeAccessToken } = useLocalStorage(
		LOCAL_STORAGE_KEY.accessToken,
	);
	const { removeItem: removeRefreshToken } = useLocalStorage(
		LOCAL_STORAGE_KEY.refreshToken,
	);

	const { mutate: withdraw } = useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			removeAccessToken();
			removeRefreshToken();
			queryClient.clear();
			toast.success("탈퇴가 완료되었습니다.");
			navigate("/login");
		},
		onError: () => {
			toast.error("탈퇴에 실패했습니다.");
		},
	});

	return (
		<div className="min-h-screen flex flex-col bg-[#121212] text-white">
			<Navbar
				toggleSidebar={toggleSidebar}
				onSearchOpen={() => setIsSearchOpen(true)}
			/>

			{/* 검색 패널 */}
			<SearchPanel
				isOpen={isSearchOpen}
				onClose={() => setIsSearchOpen(false)}
			/>

			<div className="flex flex-1 relative overflow-hidden">
				{isSidebarOpen && (
					<div
						className="fixed inset-0 bg-black/60 z-40"
						onClick={closeSidebar}
					/>
				)}

				<aside
					className={`
						fixed top-0 left-0 z-50
						w-56 h-full
						bg-[#0a0a0a] border-r border-gray-800
						flex flex-col
						transform transition-transform duration-300 ease-in-out
						${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
					`}
				>
					<div className="p-6 flex flex-col gap-4 pt-8 flex-1">
						{!accessToken ? (
							<>
								<Link
									to="/login"
									onClick={closeSidebar}
									className="text-sm hover:text-[#e91e8c] flex items-center gap-2 transition-colors"
								>
									🔑 로그인
								</Link>
								<Link
									to="/signup"
									onClick={closeSidebar}
									className="text-sm hover:text-[#e91e8c] flex items-center gap-2 transition-colors"
								>
									📝 회원가입
								</Link>
							</>
						) : (
							<>
								{/* 사이드바 찾기 버튼도 SearchPanel 열기 */}
								<button
									type="button"
									onClick={() => {
										closeSidebar();
										setIsSearchOpen(true);
									}}
									className="text-sm hover:text-[#e91e8c] flex items-center gap-2 transition-colors text-left"
								>
									🔍 찾기
								</button>
								<Link
									to="/mypage"
									onClick={closeSidebar}
									className="text-sm hover:text-[#e91e8c] flex items-center gap-2 transition-colors"
								>
									👤 마이페이지
								</Link>
							</>
						)}
					</div>

					{accessToken && (
						<div className="p-6">
							<button
								type="button"
								onClick={() => {
									closeSidebar();
									setIsWithdrawModalOpen(true);
								}}
								className="text-sm text-gray-500 hover:text-red-400 transition-colors"
							>
								탈퇴하기
							</button>
						</div>
					)}
				</aside>

				<main className="flex-1 overflow-y-auto p-6 relative min-w-0">
					<Outlet />
					{accessToken && (
						<button
							type="button"
							onClick={() => setIsLpModalOpen(true)}
							className="fixed bottom-8 right-8 bg-[#e91e8c] hover:bg-[#c2185b] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-2xl transition-transform hover:scale-110 z-50"
							aria-label="LP 추가"
						>
							+
						</button>
					)}
				</main>
			</div>

			<Footer />

			{isLpModalOpen && (
				<LpCreateModal onClose={() => setIsLpModalOpen(false)} />
			)}

			{isWithdrawModalOpen && (
				<ConfirmModal
					message="정말 탈퇴하시겠습니까?"
					onConfirm={() => {
						setIsWithdrawModalOpen(false);
						withdraw();
					}}
					onCancel={() => setIsWithdrawModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default HomeLayout;
