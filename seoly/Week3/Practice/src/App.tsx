import { useEffect, useState } from "react";

function App() {
	// 현재 주소창의 경로를 저장하는 상태
	const [currentPath, setCurrentPath] = useState(window.location.pathname);

	useEffect(() => {
		// 브라우저 '뒤로 가기/앞으로 가기' 클릭 시 화면 갱신
		const handlePopState = () => {
			setCurrentPath(window.location.pathname);
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);

	// 페이지 이동 함수
	const navigate = (path: string) => {
		window.history.pushState({}, "", path); // 브라우저 주소창 주소 변경
		setCurrentPath(path); // 리액트 상태 업데이트 -> 화면이 다시 그려짐
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* 네비게이션 바 (공통 영역) */}
			<nav className="flex gap-8 p-6 bg-white shadow-sm justify-center">
				<button
					type="button"
					onClick={() => navigate("/")}
					className={`text-xl font-bold transition-colors ${currentPath === "/" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
				>
					HOME
				</button>
				<button
					type="button"
					onClick={() => navigate("/about")}
					className={`text-xl font-bold transition-colors ${currentPath === "/about" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
				>
					ABOUT
				</button>
			</nav>

			{/* 실제 바뀌는 화면 영역 */}
			<main className="flex-1 flex items-center justify-center">
				{currentPath === "/" && (
					<div className="text-center animate-fade-in">
						<h1 className="text-5xl font-black text-gray-800 mb-4">
							여기는 HOME 화면입니다.
						</h1>
						<p className="text-gray-500 text-xl">
							성공적으로 홈에 접속하셨어요! 🏠
						</p>
					</div>
				)}

				{currentPath === "/about" && (
					<div className="text-center animate-fade-in">
						<h1 className="text-5xl font-black text-gray-800 mb-4">
							여기는 ABOUT 화면입니다.
						</h1>
						<p className="text-gray-500 text-xl">여기는 소개 페이지예요. ℹ️</p>
					</div>
				)}

				{/* 설정하지 않은 경로로 갔을 때의 예외 처리 (선택사항) */}
				{currentPath !== "/" && currentPath !== "/about" && (
					<div className="text-center">
						<h1 className="text-3xl font-bold text-red-500">
							길을 잃으셨나요?
						</h1>
						<button
							type="button"
							onClick={() => navigate("/")}
							className="mt-4 text-blue-500 underline"
						>
							홈으로 돌아가기
						</button>
					</div>
				)}
			</main>
		</div>
	);
}

export default App;
