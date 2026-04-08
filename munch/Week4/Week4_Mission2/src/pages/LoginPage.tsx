import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import googleIcon from "../assets/googleIcon.png";
import useLocalStorage from "../hooks/useLocalStorage";
import { signinSchema, type UserSigninInformation } from "../utils/validate";

const LoginPage = () => {
	const navigate = useNavigate();
	const [, setStoredUser] = useLocalStorage<UserSigninInformation | null>(
		"user",
		null,
	);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<UserSigninInformation>({
		resolver: zodResolver(signinSchema),
		mode: "onChange",
	});

	const onSubmit = (data: UserSigninInformation) => {
		console.log("로그인 완료:", data);
		setStoredUser(data);
		navigate("/");
	};

	return (
		<div className="flex flex-col items-center justify-center h-full">
			<div className="w-[340px] flex flex-col gap-4">
				<div className="flex items-center mb-2">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="text-white text-xl p-1 hover:text-[#e91e8c] transition-colors"
					>
						‹
					</button>
					<span className="flex-1 text-center text-white text-lg font-semibold">
						로그인
					</span>
					<div className="w-7" />
				</div>

				<button
					type="button"
					onClick={() => {}}
					className="w-full flex items-center justify-center gap-3 border border-gray-600 rounded py-2.5 text-white text-sm font-medium hover:border-gray-400 transition-colors"
				>
					<img src={googleIcon} alt="Google" className="w-5 h-5" />
					구글 로그인
				</button>

				<div className="flex items-center gap-3">
					<div className="flex-1 h-px bg-gray-600" />
					<span className="text-gray-400 text-sm">OR</span>
					<div className="flex-1 h-px bg-gray-600" />
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<input
							{...register("email")}
							type="email"
							placeholder="이메일을 입력해주세요!"
							className={`w-full bg-transparent border px-3 py-2.5 rounded text-white text-sm placeholder-gray-500 outline-none transition-colors
                ${errors.email ? "border-[#e91e8c] focus:border-[#e91e8c]" : "border-gray-600 focus:border-[#807bff]"}`}
						/>
						{errors.email && (
							<p className="text-[#e91e8c] text-xs">{errors.email.message}</p>
						)}
					</div>

					<div className="flex flex-col gap-1">
						<input
							{...register("password")}
							type="password"
							placeholder="비밀번호를 입력해주세요!"
							className={`w-full bg-transparent border px-3 py-2.5 rounded text-white text-sm placeholder-gray-500 outline-none transition-colors
                ${errors.password ? "border-[#e91e8c] focus:border-[#e91e8c]" : "border-gray-600 focus:border-[#807bff]"}`}
						/>
						{errors.password && (
							<p className="text-[#e91e8c] text-xs">
								{errors.password.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={!isValid}
						className="w-full py-2.5 rounded text-sm font-medium transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed bg-[#e91e8c] text-white hover:bg-[#c2185b] cursor-pointer"
					>
						로그인
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
