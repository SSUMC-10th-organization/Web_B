import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";

export default function SignupPage() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async () => {
		try {
			await postSignup(name, email, password);
			alert("회원가입 성공! 로그인해주세요.");
			navigate("/login");
		} catch {
			setError("회원가입에 실패했습니다. 다시 시도해주세요.");
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
					회원가입
				</h1>

				<input
					type="text"
					placeholder="이름"
					value={name}
					onChange={(e) => setName(e.target.value)}
					style={inputStyle}
				/>
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
					회원가입
				</button>

				<button
					type="button"
					onClick={() => navigate("/login")}
					style={{
						background: "none",
						border: "none",
						color: "#6b7280",
						cursor: "pointer",
						fontSize: "0.9rem",
					}}
				>
					이미 계정이 있으신가요? 로그인
				</button>
			</div>
		</div>
	);
}
