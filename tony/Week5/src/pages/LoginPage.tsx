import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import axiosInstance from "../lib/axios";

type LoginFields = { email: string; password: string };

const validate = (
	values: LoginFields,
): Partial<Record<keyof LoginFields, string>> => {
	const errors: Partial<Record<keyof LoginFields, string>> = {};
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
		errors.email = "유효하지 않은 이메일 형식입니다.";
	}
	if (values.password.length > 0 && values.password.length < 6) {
		errors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
	}
	return errors;
};

function LoginPage() {
	const navigate = useNavigate();
	const { values, errors, touched, handleChange, handleBlur, isValid } =
		useForm<LoginFields>({ email: "", password: "" }, validate);

	const handleSubmit = async () => {
		if (!isValid) return;

		try {
			const { data } = await axiosInstance.post("/auth/signin", {
				email: values.email,
				password: values.password,
			});

			localStorage.setItem("accessToken", data.data.accessToken);
			localStorage.setItem("refreshToken", data.data.refreshToken);
			navigate("/");
		} catch {
			alert("이메일 또는 비밀번호를 확인해주세요.");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-black text-white">
			<div className="flex flex-col w-[360px] gap-4">
				<div className="flex items-center justify-center relative mb-2">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="absolute left-0 text-white text-2xl leading-none"
					>
						‹
					</button>
					<h1 className="text-lg font-semibold">로그인</h1>
				</div>

				<div className="flex flex-col gap-1">
					<input
						type="email"
						name="email"
						placeholder="이메일을 입력해주세요!"
						value={values.email}
						onChange={handleChange}
						onBlur={handleBlur}
						className="bg-transparent border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
					/>
					{touched.email && errors.email && (
						<p className="text-red-400 text-sm">{errors.email}</p>
					)}
				</div>

				<div className="flex flex-col gap-1">
					<input
						type="password"
						name="password"
						placeholder="비밀번호를 입력해주세요!"
						value={values.password}
						onChange={handleChange}
						onBlur={handleBlur}
						className="bg-transparent border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
					/>
					{touched.password && errors.password && (
						<p className="text-red-400 text-sm">{errors.password}</p>
					)}
				</div>

				<button
					type="button"
					onClick={() =>
						(window.location.href =
							"http://localhost:8000/v1/auth/google/login")
					}
					className="flex items-center justify-center gap-3 border border-gray-600 rounded-md py-3 text-white hover:bg-gray-800 transition"
				>
					<img
						src="https://www.google.com/favicon.ico"
						alt="google"
						className="w-5 h-5"
					/>
					구글 로그인
				</button>

				<button
					type="button"
					onClick={handleSubmit}
					disabled={!isValid}
					className={`w-full py-3 rounded-md text-base font-medium transition ${
						isValid
							? "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
							: "bg-gray-800 text-gray-500 cursor-not-allowed"
					}`}
				>
					로그인
				</button>

				<button
					type="button"
					onClick={() => navigate("/signup")}
					className="text-gray-400 text-sm text-center hover:text-white transition"
				>
					계정이 없으신가요? 회원가입
				</button>
			</div>
		</div>
	);
}

export default LoginPage;
