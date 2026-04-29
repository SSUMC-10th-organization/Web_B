import { useState } from "react";
import useForm from "../../hooks/useForm";

type PasswordFields = { password: string; confirmPassword: string };

const validate = (
	values: PasswordFields,
): Partial<Record<keyof PasswordFields, string>> => {
	const errors: Partial<Record<keyof PasswordFields, string>> = {};
	if (values.password.length > 0 && values.password.length < 6) {
		errors.password = "비밀번호는 6자 이상이어야 합니다.";
	}
	if (
		values.confirmPassword.length > 0 &&
		values.password !== values.confirmPassword
	) {
		errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
	}
	return errors;
};

interface Props {
	email: string;
	onNext: (password: string) => void;
}

function PasswordStep({ email, onNext }: Props) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const { values, errors, touched, handleChange, handleBlur, isValid } =
		useForm<PasswordFields>({ password: "", confirmPassword: "" }, validate);

	return (
		<div className="flex flex-col gap-4">
			{/* 이전 단계 이메일 표시 */}
			<div className="border border-gray-600 rounded-md px-4 py-3 text-gray-400 text-sm">
				{email}
			</div>

			{/* 비밀번호 입력 */}
			<div className="flex flex-col gap-1">
				<div className="flex items-center border border-gray-600 rounded-md px-4 py-3">
					<input
						type={showPassword ? "text" : "password"}
						name="password"
						placeholder="비밀번호를 입력해주세요!"
						value={values.password}
						onChange={handleChange}
						onBlur={handleBlur}
						className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
					/>
					<button
						type="button"
						onClick={() => setShowPassword((prev) => !prev)}
						className="text-gray-400 text-lg ml-2"
					>
						{showPassword ? "👁" : "🙈"}
					</button>
				</div>
				{touched.password && errors.password && (
					<p className="text-red-400 text-sm">{errors.password}</p>
				)}
			</div>

			{/* 비밀번호 확인 */}
			<div className="flex flex-col gap-1">
				<div className="flex items-center border border-gray-600 rounded-md px-4 py-3">
					<input
						type={showConfirm ? "text" : "password"}
						name="confirmPassword"
						placeholder="비밀번호를 다시 입력해주세요!"
						value={values.confirmPassword}
						onChange={handleChange}
						onBlur={handleBlur}
						className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
					/>
					<button
						type="button"
						onClick={() => setShowConfirm((prev) => !prev)}
						className="text-gray-400 text-lg ml-2"
					>
						{showConfirm ? "👁" : "🙈"}
					</button>
				</div>
				{touched.confirmPassword && errors.confirmPassword && (
					<p className="text-red-400 text-sm">{errors.confirmPassword}</p>
				)}
			</div>

			<button
				type="button"
				onClick={() => onNext(values.password)}
				disabled={!isValid}
				className={`w-full py-3 rounded-md text-base font-medium transition ${
					isValid
						? "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
						: "bg-gray-800 text-gray-500 cursor-not-allowed"
				}`}
			>
				다음
			</button>
		</div>
	);
}

export default PasswordStep;
