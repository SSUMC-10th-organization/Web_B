import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signinSchema, type UserSigninInformation } from "../utils/validate";

const LoginPage = () => {
	const navigate = useNavigate(); // useNavigate(라이브러리) 활용해서 주소창 업데이트

	const goToHome = () => {
		navigate("/");
	};

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<UserSigninInformation>({
		resolver: zodResolver(signinSchema), // Zod 연결
		mode: "onChange", // 실시간 유효성 검사
	});

	const onSubmit = (data: UserSigninInformation) => {
		console.log("로그인 시도 데이터:", data);
		// 여기서 API 호출을 합니다.
		// goToHome();
	};

	return (
		<div className="flex flex-col items-center justify-center h-full gap-4">
			<div className="w-full max-w-[400px] flex flex-col">
				<div className="w-full flex items-center justify-center gap-10 mb-10 relative">
					<button
						type="button"
						className="absolute left-0 text-[#FFFFFF]"
						onClick={goToHome}
					>
						{`<`}
					</button>
					<h1 className="flex-1 text-center text-[#FFFFFF] text-xl font-medium">
						로그인
					</h1>
				</div>

				<button
					type="button"
					className="w-[300w] p-[10px] flex items-center justify-center gap-3 bg-[#000000] border border-[#777777] text-[#FFFFFF] py-3.5 rounded-xl mb-6 font-medium
            hover:bg-[#333333] transition-colors cursor-pointer"
				>
					<img
						src="https://authjs.dev/img/providers/google.svg"
						alt="Google"
						className="w-5 h-5"
					/>
					구글 로그인
				</button>

				<div className="flex items-center gap-4 mb-8">
					<div className="flex-1 h-[1px] bg-[#FFFFFF]"></div>
					<span className="text-[#FFFFFF] text-xs font-bold">OR</span>
					<div className="flex-1 h-[1px] bg-[#FFFFFF]"></div>
				</div>

				<div className="flex flex-col gap-3">
					<input
						onSubmit={handleSubmit(onSubmit)}
						className={`bg-[#222222]  border border-[#ccc] w-[300w] p-[10px] text-white focus:border-[#807bff] rounded-sm placeholder-[#999999]
              ${errors?.email ? "border-red-500" : "border-gray-300"}`}
						type={"email"}
						placeholder={"이메일을 입력해주세요."}
					/>
					{/* 이메일 에러 메세지 나오는 부분 */}
					{errors.email && (
						<div className="text-red-500 text-sm">{errors.email.message}</div>
					)}

					<input
						onSubmit={handleSubmit(onSubmit)}
						className={`bg-[#222222] border border-[#ccc] w-[300w] p-[10px] text-white focus:border-[#807bff] rounded-sm placeholder-[#999999]
              ${errors?.password ? "border-red-500" : "border-gray-300"}`}
						type={"password"}
						placeholder={"비밀번호를 입력해주세요."}
					/>
					{errors.password && (
						<div className="text-red-500 text-sm">
							{errors.password.message}
						</div>
					)}
					<button
						className="w-full bg-[#D7288E] text-white py-3 rounded-md text-lg font-medium hover:bg-[#C32A82] transition-colors cursor-pointer disabled:bg-gray-700"
						type="submit"
						disabled={!isValid}
					>
						로그인
					</button>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
