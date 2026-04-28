import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
	const { tokenA, logout } = useAuth();

	const handleLogout = () => {
		logout();
		alert("로그아웃 되었습니다.");
	};

	return (
		<nav className="flex items-center justify-between px-8 py-4 bg-gray-900 text-white shadow-md">
			<div className="flex items-center gap-8">
				<Link
					to="/"
					className="text-3xl font-black text-purple-400 hover:text-purple-300 transition-colors"
				>
					JungBin
				</Link>

				<Link
					to="/mypage"
					className="text-lg font-medium text-gray-300 hover:text-purple-400 transition-colors"
				>
					MyPage
				</Link>
			</div>

			<div className="flex items-center gap-4">
				{tokenA ? (
					<button
						type="button"
						onClick={handleLogout}
						className="px-5 py-2 font-bold bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all shadow-lg border border-gray-700"
					>
						로그아웃
					</button>
				) : (
					<>
						<Link
							to="/login"
							className="px-5 py-2 font-bold text-gray-300 hover:text-white transition-colors"
						>
							로그인
						</Link>

						<Link
							to="/signup"
							className="px-5 py-2 font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
						>
							회원가입
						</Link>
					</>
				)}
			</div>
		</nav>
	);
};