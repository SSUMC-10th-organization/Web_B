import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { type EmailStepInformation, emailStepSchema } from "../utils/validate";

interface EmailStepProps {
	onNext: (email: string) => void; // 다음 단계로 넘어가는 함수
}

const EmailStep = ({ onNext }: EmailStepProps) => {
	const navigate = useNavigate();

	const goToHome = () => {
		navigate("/");
	};

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isValid },
	} = useForm<EmailStepInformation>({
		resolver: zodResolver(emailStepSchema),
		mode: "onChange", // 실시간으로 에러 메시지를 보여주기!
		defaultValues: {
			email: "",
		},
	});

	const handleNext = () => {
		const currentEmail = getValues("email");
		onNext(currentEmail);
	};

	return (
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
					회원가입
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
					{...register("email")}
					className={`bg-[#222222]  border border-[#ccc] w-[300w] p-[10px] text-white focus:border-[#807bff] rounded-sm placeholder-[#999999]`}
					type={"email"}
					placeholder={"이메일을 입력해주세요."}
				/>

				{errors.email && (
					<div className="text-red-500 text-sm">{errors.email.message}</div>
				)}

				<button
					className="w-full bg-[#D7288E] text-white py-3 rounded-md text-lg font-medium hover:bg-[#C32A82] transition-colors cursor-pointer disabled:bg-gray-700"
					type="button"
					onClick={handleSubmit(handleNext)}
					disabled={!isValid}
				>
					다음
				</button>
			</div>
		</div>
	);
};

export default EmailStep;
