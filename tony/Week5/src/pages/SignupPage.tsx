import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import axiosInstance from "../lib/axios";

type SignupFields = { name: string; email: string; password: string };

const validate = (
	values: SignupFields,
): Partial<Record<keyof SignupFields, string>> => {
	const errors: Partial<Record<keyof SignupFields, string>> = {};
	if (values.name.trim().length === 0) {
		errors.name = "이름을 입력해주세요.";
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
		errors.email = "유효하지 않은 이메일 형식입니다.";
	}
	if (values.password.length > 0 && values.password.length < 6) {
		errors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
	}
	return errors;
};

function SignupPage() {
	const navigate = useNavigate();
	const { values, errors, touched, handleChange, handleBlur, isValid } =
		useForm<SignupFields>({ name: "", email: "", password: "" }, validate);

	const handleSubmit = async () => {
		if (!isValid) return;

		try {
			await axiosInstance.post("/auth/signup", {
				name: values.name,
				email: values.email,
				password: values.password,
			});
			alert("회원가입 성공! 로그인해주세요.");
			navigate("/login");
		} catch {
			alert("회원가입에 실패했습니다. 다시 시도해주세요.");
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
					<h1 className="text-lg font-semibold">회원가입</h1>
				</div>

				<div className="flex flex-col gap-1">
					<input
						type="text"
						name="name"
						placeholder="이름을 입력해주세요!"
						value={values.name}
						onChange={handleChange}
						onBlur={handleBlur}
						className="bg-transparent border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
					/>
					{touched.name && errors.name && (
						<p className="text-red-400 text-sm">{errors.name}</p>
					)}
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
					onClick={handleSubmit}
					disabled={!isValid}
					className={`w-full py-3 rounded-md text-base font-medium transition ${
						isValid
							? "bg-gray-700 text-white hover:bg-gray-600 cursor-pointer"
							: "bg-gray-800 text-gray-500 cursor-not-allowed"
					}`}
				>
					회원가입
				</button>

				<button
					type="button"
					onClick={() => navigate("/login")}
					className="text-gray-400 text-sm text-center hover:text-white transition"
				>
					이미 계정이 있으신가요? 로그인
				</button>
			</div>
		</div>
	);
}

export default SignupPage;
