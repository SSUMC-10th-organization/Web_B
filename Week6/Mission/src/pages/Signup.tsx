import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { publicApi } from "../apis/axiosInstance";
import {
	signupSchema,
	type SignupFormInput,
	type SignupFormValues,
} from "../schemas/authSchema";

type SignupStep = 1 | 2 | 3;

type ErrorResponse = {
	message?: string;
};

export const Signup = () => {
	const navigate = useNavigate();
	const [step, setStep] = useState<SignupStep>(1);
	const [showPw, setShowPw] = useState(false);
	const [showPwr, setShowPwr] = useState(false);

	const {
		register,
		handleSubmit,
		trigger,
		watch,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<SignupFormInput, unknown, SignupFormValues>({
		resolver: zodResolver(signupSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			nickname: "",
		},
	});

	const email = watch("email");
	const password = watch("password");
	const confirmPassword = watch("confirmPassword");
	const nickname = watch("nickname");

	const handleBack = () => {
		if (step === 1) {
			navigate(-1);
			return;
		}

		setStep((step - 1) as SignupStep);
	};

	const handleEmailNext = async () => {
		const isEmailValid = await trigger("email", { shouldFocus: true });

		if (isEmailValid) {
			setStep(2);
		}
	};

	const handlePasswordNext = async () => {
		const isPasswordStepValid = await trigger(
			["password", "confirmPassword"],
			{ shouldFocus: true },
		);

		if (isPasswordStepValid) {
			setStep(3);
		}
	};

	const handleSignup = async (data: SignupFormValues) => {
		const requestBody = {
			email: data.email,
			password: data.password,
			name: data.nickname,
			avatar: null,
			bio: null,
		};

		try {
			await publicApi.post("/v1/auth/signup", requestBody);

			alert("회원가입 성공!");
			navigate("/login");
		} catch (error) {
			const axiosError = error as AxiosError<ErrorResponse>;

			setError("root", {
				message:
					axiosError.response?.data?.message ?? "회원가입에 실패했습니다.",
			});
		}
	};

	const canGoEmailNext = email.trim().length > 0 && !errors.email;

	const isPasswordMismatch =
		confirmPassword.length > 0 && password !== confirmPassword;

	const canGoPasswordNext =
		password.length > 0 &&
		confirmPassword.length > 0 &&
		!isPasswordMismatch &&
		!errors.password &&
		!errors.confirmPassword;

	const canSubmit = nickname.trim().length > 0 && !errors.nickname && !isSubmitting;

	return (
		<div className="flex flex-col items-center justify-center mt-20 px-4 text-white">
			<div className="w-full max-w-md flex flex-col gap-6">
				<div className="relative flex items-center justify-center w-full mb-4">
					<button
						type="button"
						onClick={handleBack}
						className="absolute left-0 text-3xl font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
					>
						&lt;
					</button>

					<h1 className="text-2xl font-bold">회원가입</h1>
				</div>

				{step > 1 && (
					<div className="w-full p-4 bg-gray-800 rounded-xl border border-purple-500/50 flex flex-col gap-1">
						<span className="text-gray-400 text-xs">아이디</span>
						<span className="font-bold text-lg">{email}</span>
					</div>
				)}

				<form
					onSubmit={handleSubmit(handleSignup)}
					noValidate
					className="flex flex-col gap-4"
				>
					{step === 1 && (
						<>
							<input
								type="email"
								placeholder="이메일을 입력해주세요"
								aria-invalid={!!errors.email}
								{...register("email")}
								className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-800 focus:border-purple-500 focus:outline-none transition-all"
							/>

							{errors.email?.message && (
								<p className="text-red-500 text-xs mt-1 ml-2">
									{errors.email.message}
								</p>
							)}

							<button
								type="button"
								disabled={!canGoEmailNext}
								onClick={handleEmailNext}
								className={`w-full py-4 mt-2 font-bold rounded-xl transition-all ${
									canGoEmailNext
										? "bg-purple-600 text-white"
										: "bg-gray-800 text-gray-500 cursor-not-allowed"
								}`}
							>
								다음
							</button>
						</>
					)}

					{step === 2 && (
						<>
							<div className="relative w-full">
								<input
									type={showPw ? "text" : "password"}
									placeholder="비밀번호를 입력해주세요"
									aria-invalid={!!errors.password}
									{...register("password")}
									className="w-full p-4 pr-12 bg-gray-900 text-white rounded-xl border border-gray-800 focus:border-purple-500 focus:outline-none transition-all"
								/>

								<button
									type="button"
									onClick={() => setShowPw((prev) => !prev)}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300"
								>
									{showPw ? "숨기기" : "보기"}
								</button>
							</div>

							{errors.password?.message && (
								<p className="text-red-500 text-xs mt-1 ml-2">
									{errors.password.message}
								</p>
							)}

							<div className="relative w-full">
								<input
									type={showPwr ? "text" : "password"}
									placeholder="비밀번호를 한 번 더 입력해주세요"
									aria-invalid={!!errors.confirmPassword}
									{...register("confirmPassword")}
									className="w-full p-4 pr-12 bg-gray-900 text-white rounded-xl border border-gray-800 focus:border-purple-500 focus:outline-none transition-all"
								/>

								<button
									type="button"
									onClick={() => setShowPwr((prev) => !prev)}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300"
								>
									{showPwr ? "숨기기" : "보기"}
								</button>
							</div>

							{errors.confirmPassword?.message ? (
								<p className="text-red-500 text-xs mt-1 ml-2">
									{errors.confirmPassword.message}
								</p>
							) : (
								isPasswordMismatch && (
									<p className="text-red-500 text-xs mt-1 ml-2">
										비밀번호가 일치하지 않습니다.
									</p>
								)
							)}

							<button
								type="button"
								disabled={!canGoPasswordNext}
								onClick={handlePasswordNext}
								className={`w-full py-4 mt-2 font-bold rounded-xl transition-all ${
									canGoPasswordNext
										? "bg-purple-600 text-white shadow-lg"
										: "bg-gray-800 text-gray-500 cursor-not-allowed"
								}`}
							>
								다음
							</button>
						</>
					)}

					{step === 3 && (
						<div className="flex flex-col items-center gap-8 animate-fadeIn">
							<div className="flex flex-col items-center gap-3">
								<div className="w-28 h-28 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700 shadow-inner">
									<span className="text-5xl">👤</span>
								</div>
							</div>

							<div className="w-full flex flex-col gap-4">
								<div className="flex flex-col gap-2">
									<label
										htmlFor="nickname"
										className="text-sm ml-1 text-gray-400"
									>
										닉네임
									</label>

									<input
										type="text"
										id="nickname"
										placeholder="닉네임을 입력해주세요"
										aria-invalid={!!errors.nickname}
										{...register("nickname")}
										className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-800 focus:border-purple-500 focus:outline-none transition-all"
									/>
								</div>

								{errors.nickname?.message && (
									<p className="text-red-500 text-xs mt-1 ml-2">
										{errors.nickname.message}
									</p>
								)}

								{errors.root?.message && (
									<p className="text-red-500 text-xs mt-1 ml-2">
										{errors.root.message}
									</p>
								)}

								<button
									type="submit"
									disabled={!canSubmit}
									className={`w-full py-4 mt-4 font-bold rounded-xl transition-all ${
										canSubmit
											? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
											: "bg-gray-800 text-gray-500 cursor-not-allowed"
									}`}
								>
									{isSubmitting ? "가입 중..." : "회원가입 완료"}
								</button>
							</div>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};