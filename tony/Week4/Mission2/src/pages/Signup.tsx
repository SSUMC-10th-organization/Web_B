import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailStep from "../components/signup/EmailStep";
import PasswordStep from "../components/signup/PasswordStep";
import ProfileStep from "../components/signup/ProfileStep";
import useLocalStorage from "../hooks/useLocalStorage";
import type { SignupData, UserInfo } from "../types/auth";

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
	1: "이메일 입력",
	2: "비밀번호 설정",
	3: "프로필 설정",
};

function Signup() {
	const navigate = useNavigate();
	const [step, setStep] = useState<Step>(1);
	const [signupData, setSignupData] = useState<Omit<SignupData, "nickname">>({
		email: "",
		password: "",
	});

	// 로컬 스토리지에 유저 정보 저장
	const { setValue: saveUser } = useLocalStorage<UserInfo | null>("user", null);

	const handleEmailNext = (email: string) => {
		setSignupData((prev) => ({ ...prev, email }));
		setStep(2);
	};

	const handlePasswordNext = (password: string) => {
		setSignupData((prev) => ({ ...prev, password }));
		setStep(3);
	};

	const handleComplete = (nickname: string) => {
		const finalData: SignupData = { ...signupData, nickname };
		console.log("회원가입 완료:", finalData);

		// TODO: 실제 API 호출 후 받은 토큰을 저장
		const fakeToken = "mock-token-xyz"; // 임시 토큰
		saveUser({
			token: fakeToken,
			email: finalData.email,
			nickname: finalData.nickname,
		});

		alert("회원가입이 완료되었습니다!");
		navigate("/");
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-black text-white">
			<div className="flex flex-col w-[360px] gap-4">
				{/* 헤더 */}
				<div className="flex items-center justify-center relative mb-2">
					<button
						type="button"
						onClick={() =>
							step === 1 ? navigate(-1) : setStep((prev) => (prev - 1) as Step)
						}
						className="absolute left-0 text-white text-2xl leading-none"
					>
						‹
					</button>
					<h1 className="text-lg font-semibold">{STEP_LABELS[step]}</h1>
				</div>

				{/* 단계 표시 바 */}
				<div className="flex gap-1 mb-2">
					{([1, 2, 3] as Step[]).map((s) => (
						<div
							key={s}
							className={`flex-1 h-1 rounded-full transition-colors ${
								s <= step ? "bg-white" : "bg-gray-600"
							}`}
						/>
					))}
				</div>

				{step === 1 && <EmailStep onNext={handleEmailNext} />}
				{step === 2 && (
					<PasswordStep email={signupData.email} onNext={handlePasswordNext} />
				)}
				{step === 3 && <ProfileStep onComplete={handleComplete} />}
			</div>
		</div>
	);
}

export default Signup;
