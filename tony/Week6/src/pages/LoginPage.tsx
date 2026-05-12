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

	const handleSubmit = async () => {
		try {
			const data = await postSignin(email, password);
			tokenStorage.setAccessToken(data.accessToken);
			tokenStorage.setRefreshToken(data.refreshToken);
			localStorage.setItem("nickname", data.name);
			navigate(from, { replace: true });
		} catch {
			setError("이메일 또는 비밀번호를 확인해주세요.");
		}
	};

	const inputStyle = {
		width: "100%",
		padding: "0.75rem 1rem",
		borderRadius: "6px",
		border: "1px solid #d1d5db",
		fontSize: "0.95rem",
		boxSizing: "border-box" as const,
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "100vh",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "360px",
					gap: "1rem",
				}}
			>
				<h1
					style={{
						textAlign: "center",
						fontSize: "1.25rem",
						fontWeight: "bold",
					}}
				>
					로그인
				</h1>

				<input
					type="email"
					placeholder="이메일"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					style={inputStyle}
				/>
				<input
					type="password"
					placeholder="비밀번호"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					style={inputStyle}
				/>

				{error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}

				<button
					type="button"
					onClick={handleSubmit}
					style={{
						padding: "0.75rem",
						borderRadius: "6px",
						border: "none",
						background: "#ec4899",
						color: "#fff",
						fontWeight: "bold",
						cursor: "pointer",
					}}
				>
					로그인
				</button>

				<button
					type="button"
					onClick={() => navigate("/signup")}
					style={{
						background: "none",
						border: "none",
						color: "#6b7280",
						cursor: "pointer",
						fontSize: "0.9rem",
					}}
				>
					계정이 없으신가요? 회원가입
				</button>
			</div>
		</div>
	);
}
