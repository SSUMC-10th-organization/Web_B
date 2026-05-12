import { Link, useNavigate } from "react-router-dom";
import { postSignout } from "../apis/auth";
import { tokenStorage } from "../lib/tokenStorage";

interface HeaderProps {
	onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
	const navigate = useNavigate();
	const nickname = localStorage.getItem("nickname");
	const isLoggedIn = !!tokenStorage.getAccessToken();

	const handleLogout = async () => {
		try {
			await postSignout();
		} catch {
			// 서버 실패해도 로컬 토큰 제거
		}
		tokenStorage.clearTokens();
		localStorage.removeItem("nickname");
		navigate("/login");
	};

	return (
		<header className="flex items-center justify-between px-6 h-[60px] bg-black sticky top-0 z-10">
			{/* 왼쪽: 햄버거 + 로고 */}
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={onMenuClick}
					className="bg-transparent border-0 cursor-pointer p-0 flex items-center text-white"
					aria-label="메뉴"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 48 48"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>메뉴</title>
						<path
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="4"
							d="M7.95 11.95h32m-32 12h32m-32 12h32"
						/>
					</svg>
				</button>
				<Link to="/" className="font-bold text-xl no-underline text-pink-500">
					돌려돌려LP판
				</Link>
			</div>

			{/* 오른쪽: 로그인 상태 */}
			<div className="flex items-center gap-3">
				{isLoggedIn ? (
					<>
						<span className="text-sm text-gray-300">
							{nickname}님 반갑습니다.
						</span>
						<button
							type="button"
							onClick={handleLogout}
							className="px-4 py-[0.4rem] border border-gray-600 rounded-md cursor-pointer bg-transparent text-white text-sm"
						>
							로그아웃
						</button>
					</>
				) : (
					<>
						<Link to="/login">
							<button
								type="button"
								className="px-4 py-[0.4rem] border border-gray-600 rounded-md cursor-pointer bg-transparent text-white text-sm"
							>
								로그인
							</button>
						</Link>
						<Link to="/signup">
							<button
								type="button"
								className="px-4 py-[0.4rem] border-0 rounded-md cursor-pointer bg-pink-500 text-white text-sm font-bold"
							>
								회원가입
							</button>
						</Link>
					</>
				)}
			</div>
		</header>
	);
}
