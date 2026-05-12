import { Link, useLocation, useNavigate } from "react-router-dom";
import { postSignout } from "../apis/auth";
import { tokenStorage } from "../lib/tokenStorage";

interface HeaderProps {
	onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
	const navigate = useNavigate();
	useLocation();
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
		<header
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "0 1.5rem",
				height: "60px",
				backgroundColor: "#000",
				position: "sticky",
				top: 0,
				zIndex: 10,
			}}
		>
			{/* 왼쪽: 햄버거 + 로고 */}
			<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
				<button
					type="button"
					onClick={onMenuClick}
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						padding: 0,
						display: "flex",
						alignItems: "center",
						color: "#fff",
					}}
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
				<Link
					to="/"
					style={{
						fontWeight: "bold",
						fontSize: "1.25rem",
						textDecoration: "none",
						color: "#ec4899",
					}}
				>
					돌려돌려LP판
				</Link>
			</div>

			{/* 오른쪽: 로그인 상태 */}
			<div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
				{isLoggedIn ? (
					<>
						<span style={{ fontSize: "0.9rem", color: "#d1d5db" }}>
							{nickname}님 반갑습니다.
						</span>
						<button
							type="button"
							onClick={handleLogout}
							style={{
								padding: "0.4rem 1rem",
								border: "1px solid #4b5563",
								borderRadius: "6px",
								cursor: "pointer",
								background: "transparent",
								color: "#fff",
								fontSize: "0.9rem",
							}}
						>
							로그아웃
						</button>
					</>
				) : (
					<>
						<Link to="/login">
							<button
								type="button"
								style={{
									padding: "0.4rem 1rem",
									border: "1px solid #4b5563",
									borderRadius: "6px",
									cursor: "pointer",
									background: "transparent",
									color: "#fff",
									fontSize: "0.9rem",
								}}
							>
								로그인
							</button>
						</Link>
						<Link to="/signup">
							<button
								type="button"
								style={{
									padding: "0.4rem 1rem",
									border: "none",
									borderRadius: "6px",
									cursor: "pointer",
									background: "#ec4899",
									color: "#fff",
									fontSize: "0.9rem",
									fontWeight: "bold",
								}}
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
