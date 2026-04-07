import { useNavigate } from "react-router-dom";

const Header = () => {
	const navigate = useNavigate();

	// 로그인 페이지로
	const goToLogin = () => {
		navigate("/login");
	};
	// 회원가입 페이지로
	const goToSignup = () => {
		navigate("/signup");
	};
	// 로고 클릭 -> 홈으로
	const goToHome = () => {
		navigate("/");
	};

	return (
		<header className="w-full bg-[#222222] py-4 px-6 flex items-center justify-between">
			<button
				type="button"
				className="text-[#D7288E] text-xl font-bold"
				onClick={goToHome}
			>
				돌려돌려LP판
			</button>

			<div className="flex items-center gap-4">
				<button
					className="bg-[#000000] text-[#FFFFFF] text-sm px-2 py-1 rounded"
					type="button"
					onClick={goToLogin}
				>
					로그인
				</button>
				<button
					className="bg-[#D7288E] text-[#FFFFFF] text-sm font-bold px-2 py-1 rounded hover:opacity-90 transition"
					type="button"
					onClick={goToSignup}
				>
					회원가입
				</button>
			</div>
		</header>
	);
};

export default Header;
