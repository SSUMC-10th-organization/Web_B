import { useNavigate } from "react-router-dom";

function HomePage() {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		navigate("/login");
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-black text-white gap-6">
			<h1 className="text-3xl font-bold">🏠 홈</h1>
			<button
				type="button"
				onClick={() => navigate("/premium")}
				className="px-6 py-3 bg-purple-700 rounded-md hover:bg-purple-600 transition"
			>
				프리미엄 페이지로 이동
			</button>
			<button
				type="button"
				onClick={handleLogout}
				className="px-6 py-3 bg-gray-700 rounded-md hover:bg-gray-600 transition"
			>
				로그아웃
			</button>
		</div>
	);
}

export default HomePage;
