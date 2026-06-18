import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postSignin } from "../apis/auth";
import { tokenStorage } from "../lib/tokenStorage";

export default function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const from =
		(location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const { mutate: signin, isPending } = useMutation({
		mutationFn: () => postSignin(email, password),
		onSuccess: (data) => {
			tokenStorage.setAccessToken(data.accessToken);
			tokenStorage.setRefreshToken(data.refreshToken);
			localStorage.setItem("nickname", data.name);
			navigate(from, { replace: true });
		},
		onError: () => {
			setError("이메일 또는 비밀번호를 확인해주세요.");
		},
	});

	const inputClass =
		"w-full px-4 py-3 rounded-md border border-gray-300 text-[0.95rem]";

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<div className="flex flex-col w-[360px] gap-4">
				<h1 className="text-center text-xl font-bold">로그인</h1>

				<input
					type="email"
					placeholder="이메일"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className={inputClass}
				/>
				<input
					type="password"
					placeholder="비밀번호"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") signin();
					}}
					className={inputClass}
				/>

				{error && <p className="text-red-500 text-[0.85rem]">{error}</p>}

				<button
					type="button"
					onClick={() => signin()}
					disabled={isPending}
					className={`py-3 rounded-md border-0 bg-pink-500 text-white font-bold ${isPending ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
				>
					{isPending ? "로그인 중..." : "로그인"}
				</button>

				<button
					type="button"
					onClick={() => navigate("/signup")}
					className="bg-transparent border-0 text-gray-500 cursor-pointer text-[0.9rem]"
				>
					계정이 없으신가요? 회원가입
				</button>
			</div>
		</div>
	);
}
