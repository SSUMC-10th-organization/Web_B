import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { postSignup } from "../apis/auth";
import { toast } from "../components/Toast";
import useForm from "../hooks/useForm";
import type { UserSignupInformation } from "../utils/validate";
import { validateSignup } from "../utils/validate";

const SignupPage = () => {
	const navigate = useNavigate();

	const { values, errors, touched, getInputProps } =
		useForm<UserSignupInformation>({
			initialValue: { name: "", email: "", password: "" },
			validate: validateSignup,
		});

	const { mutate: signup, isPending } = useMutation({
		mutationFn: () =>
			postSignup({
				name: values.name,
				email: values.email,
				password: values.password,
			}),
		onSuccess: () => {
			toast.success("회원가입 성공! 로그인 해주세요.");
			navigate("/login");
		},
		onError: () => {
			toast.error("회원가입에 실패했습니다.");
		},
	});

	const isDisabled =
		Object.values(errors || {}).some((error) => error.length > 0) ||
		Object.values(values).some((value) => value === "") ||
		isPending;

	return (
		<div className="flex flex-col items-center justify-center h-full gap-4">
			<div className="flex flex-col gap-3">
				<input
					{...getInputProps("name")}
					className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
						errors?.name && touched?.name
							? "border-red-500 bg-red-200"
							: "border-gray-300"
					}`}
					type="text"
					placeholder="이름"
				/>
				{errors?.name && touched?.name && (
					<div className="text-red-500 text-sm">{errors.name}</div>
				)}
				<input
					{...getInputProps("email")}
					className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
						errors?.email && touched?.email
							? "border-red-500 bg-red-200"
							: "border-gray-300"
					}`}
					type="email"
					placeholder="이메일"
				/>
				{errors?.email && touched?.email && (
					<div className="text-red-500 text-sm">{errors.email}</div>
				)}
				<input
					{...getInputProps("password")}
					className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
						errors?.password && touched?.password
							? "border-red-500 bg-red-200"
							: "border-gray-300"
					}`}
					type="password"
					placeholder="비밀번호"
				/>
				{errors?.password && touched?.password && (
					<div className="text-red-500 text-sm">{errors.password}</div>
				)}
				<button
					type="button"
					onClick={() => signup()}
					disabled={isDisabled}
					className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
				>
					{isPending ? "처리 중..." : "회원가입"}
				</button>
			</div>
		</div>
	);
};

export default SignupPage;
