import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const GoogleCallback = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const { setTokenA, setTokenR, setNick } = useAuth();

	useEffect(() => {
		const accessToken = searchParams.get("accessToken");
		const refreshToken = searchParams.get("refreshToken");
		const name = searchParams.get("name");

		if (!accessToken || !refreshToken || !name) {
			alert("구글 로그인에 실패했습니다.");
			navigate("/login", { replace: true });
			return;
		}

		setTokenA(accessToken);
		setTokenR(refreshToken);
		setNick(name);

		alert(`${name}님, 환영합니다!`);

		// URL에 토큰이 남지 않도록 replace로 이동
		navigate("/", { replace: true });
	}, [searchParams, setTokenA, setTokenR, setNick, navigate]);

	return (
		<div className="flex items-center justify-center min-h-screen bg-black text-white">
			<p className="text-xl font-bold">구글 로그인 처리 중...</p>
		</div>
	);
};