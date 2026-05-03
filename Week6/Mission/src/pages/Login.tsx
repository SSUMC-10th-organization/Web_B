import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { publicApi } from "../apis/axiosInstance";
import { useAuth } from "../context/AuthContext";
import {
	loginSchema,
	type LoginFormInput,
	type LoginFormValues,
} from "../schemas/authSchema";

type LoginResponse = {
	status: boolean;
	statusCode: number;
	message: string;
	data: {
		id: number;
		name: string;
		accessToken: string;
		refreshToken: string;
	};
};

type ErrorResponse = {
	message?: string;
};

export const LoginPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { setTokenA, setTokenR, setNick } = useAuth();

	const from = location.state?.from ?? "/";

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid, isSubmitting },
	} = useForm<LoginFormInput, unknown, LoginFormValues>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleLogin = async (data: LoginFormValues) => {
		try {
			const response = await publicApi.post<LoginResponse>("/v1/auth/signin", {
				email: data.email,
				password: data.password,
			});

			const { accessToken, refreshToken, name } = response.data.data;

			setTokenA(accessToken);
			setTokenR(refreshToken);
			setNick(name);

			alert(`${name}님, 환영합니다!`);
			navigate(from, { replace: true });
		} catch (error) {
			const axiosError = error as AxiosError<ErrorResponse>;

			setError("root", {
				message:
					axiosError.response?.data?.message ??
					"이메일 또는 비밀번호를 확인해주세요.",
			});
		}
	};

	const handleGoogleLogin = () => {
	window.location.href = "http://localhost:8000/v1/auth/google/login";
	};

	return (
		<div className="flex flex-col items-center justify-center mt-20 px-4 text-white">
			<div className="w-full max-w-md flex flex-col gap-6">
				<div className="relative flex items-center justify-center w-full mb-4">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="absolute left-0 text-3xl font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
					>
						&lt;
					</button>

					<h1 className="text-2xl font-bold">로그인</h1>
				</div>

				<button
					type="button"
					onClick={handleGoogleLogin}
					className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center shadow-sm"
					>
					구글 로그인
				</button>

				<div className="flex items-center justify-center gap-4 text-gray-500 font-medium px-2">
					<div className="flex-1 h-px bg-gray-800" />
					<span>or</span>
					<div className="flex-1 h-px bg-gray-800" />
				</div>

				<form
					onSubmit={handleSubmit(handleLogin)}
					noValidate
					className="flex flex-col gap-4"
				>
					<input
						type="email"
						placeholder="이메일을 입력해주세요"
						aria-invalid={!!errors.email}
						{...register("email")}
						className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-800 focus:border-purple-500 focus:outline-none transition-all"
					/>

					{errors.email?.message && (
						<p className="text-red-500 text-xs mt-2 ml-2">
							{errors.email.message}
						</p>
					)}

					<input
						type="password"
						placeholder="비밀번호를 입력해주세요"
						aria-invalid={!!errors.password}
						{...register("password")}
						className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-800 focus:border-purple-500 focus:outline-none transition-all"
					/>

					{errors.password?.message && (
						<p className="text-red-500 text-xs mt-2 ml-2">
							{errors.password.message}
						</p>
					)}

					{errors.root?.message && (
						<p className="text-red-500 text-xs mt-2 ml-2">
							{errors.root.message}
						</p>
					)}

					<button
						type="submit"
						disabled={!isValid || isSubmitting}
						className={`w-full py-4 font-bold rounded-xl transition-all ${
							isValid && !isSubmitting
								? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
								: "bg-gray-800 text-gray-500 cursor-not-allowed"
						}`}
					>
						{isSubmitting ? "로그인 중..." : "로그인"}
					</button>
				</form>
			</div>
		</div>
	);
};