import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import emailIcon from "../assets/mail.png";
import visibilityIcon from "../assets/visibility.png";
import invisibilityIcon from "../assets/visibility_off.png";
import {
	type PasswordStepInformation,
	passwordStepSchema,
} from "../utils/validate";

interface PasswordStepProps {
	email: string;
	onNext: (password: string) => void;
	onPrev: () => void;
}

const PasswordStep = ({ email, onNext, onPrev }: PasswordStepProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const toggleShowPassword = () => setShowPassword(!showPassword);

	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const toggleShowPasswordConfirm = () =>
		setShowPasswordConfirm(!showPasswordConfirm);

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isValid },
	} = useForm<PasswordStepInformation>({
		resolver: zodResolver(passwordStepSchema),
		mode: "onChange",
		defaultValues: {
			password: "",
			passwordConfirm: "",
		},
	});

	const handleNext = () => {
		const password = getValues("password");
		onNext(password);
	};

	return (
		<div className="w-full max-w-[400px] flex flex-col">
			{/* < 회원가입 */}
			<div className="w-full flex items-center justify-center gap-10 mb-10 relative">
				<button
					type="button"
					className="absolute left-0 text-[#FFFFFF]"
					onClick={onPrev}
				>
					{`<`}
				</button>
				<h1 className="flex-1 text-center text-[#FFFFFF] text-xl font-medium">
					회원가입
				</h1>
			</div>

			{/* 이메일-입력-입력-버튼 */}
			<div className="flex flex-col gap-3">
				<div className="text-white text-sm font-bold w-full flex items-center justify-center gap-8 mb-10 relative">
					<img src={emailIcon} alt="Email" className="w-5 h-5" />
					<div>{email}</div>
				</div>

				{/* 여기부터 다시 시작 */}
				<div className="relative w-full">
					<input
						{...register("password")}
						className={`bg-[#222222]  border border-[#ccc] w-full p-[10px] text-white focus:border-[#807bff] rounded-sm placeholder-[#999999]
                ${errors?.password ? "border-red-500" : "border-gray-300"}`}
						type={showPassword ? "text" : "password"}
						placeholder={"비밀번호를 입력해주세요."}
					/>

					<button
						type="button"
						onClick={toggleShowPassword}
						className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
					>
						<img
							src={showPassword ? visibilityIcon : invisibilityIcon}
							alt={showPassword ? "비밀번호 보이기" : "비밀번호 숨기기"}
							className="w-5 h-5 object-contain"
						/>
					</button>
				</div>

				{errors.password && (
					<div className="text-red-500 text-sm">{errors.password.message}</div>
				)}

				<div className="relative w-full">
					<input
						{...register("passwordConfirm")}
						className={`bg-[#222222]  border border-[#ccc] w-full p-[10px] text-white focus:border-[#807bff] rounded-sm placeholder-[#999999]
                ${errors.passwordConfirm ? "border-red-500" : "border-[#ccc]"}`}
						type={showPasswordConfirm ? "text" : "password"}
						placeholder={"비밀번호를 다시 한 번 입력해주세요."}
					/>

					<button
						type="button"
						onClick={toggleShowPasswordConfirm}
						className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
					>
						<img
							src={showPasswordConfirm ? visibilityIcon : invisibilityIcon}
							alt={showPasswordConfirm ? "비밀번호 보이기" : "비밀번호 숨기기"}
							className="w-5 h-5 object-contain"
						/>
					</button>
				</div>

				{errors.passwordConfirm && (
					<div className="text-red-500 text-sm">
						{errors.passwordConfirm.message}
					</div>
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

export default PasswordStep;
