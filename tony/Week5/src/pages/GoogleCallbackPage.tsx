import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function GoogleCallbackPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const accessToken = searchParams.get("accessToken");
		const refreshToken = searchParams.get("refreshToken");

		if (accessToken && refreshToken) {
			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("refreshToken", refreshToken);
			navigate("/", { replace: true });
		} else {
			navigate("/login", { replace: true });
		}
	}, [navigate, searchParams]);

	return (
		<div className="flex items-center justify-center h-screen bg-black text-white">
			<p>로그인 처리 중...</p>
		</div>
	);
}

export default GoogleCallbackPage;
