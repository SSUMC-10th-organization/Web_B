import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const HomePage = () => {
	const { tokenA, nickname } = useAuth();

	return (
		<div className="flex items-center justify-center min-h-screen bg-black text-white">
			<h1 className="text-4xl font-bold transition-all duration-500">
				{tokenA ? (
					// 로그인이 된 상태
					<span>{nickname}님, 환영합니다!</span>
				) : (
					// 로그인이 안 된 상태
					<span className="text-gray-400">로그인 후 이용해주세요</span>
				)}
			</h1>
		</div>
	);
};
