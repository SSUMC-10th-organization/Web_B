import { useAuth } from "../context/AuthContext";

export const MyPage = () => {
	const { nickname } = useAuth();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-4">
			<h1 className="text-4xl font-bold">마이페이지</h1>
			<p className="text-gray-400">
				{nickname}님만 볼 수 있는 페이지입니다.
			</p>
		</div>
	);
};