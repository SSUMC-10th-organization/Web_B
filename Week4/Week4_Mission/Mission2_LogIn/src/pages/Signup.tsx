import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";

export const Signup = () => {
	const navigate = useNavigate();
	// step 상태 추가 (1: 이메일 입력, 2: 비밀번호 입력)
	const [step, setStep] = useState(1);

	const [showPw, setshowPw] = useState(false); // 회원가입 감춰진 비밀번호 보기
	const [showPwr, setshowPwr] = useState(false); // 회원가입 감춰진 비밀번호 재입력 보기

	const { values, iderror, pwerror, canlogin, checkpw, handleChange } = useForm(
		{
			email: "",
			password: "",
			confirmPassword: "", // 비밀번호 확인용
			nickname: "",
		},
	);

	//뒤로가기 로직 커스텀
	const handleBack = () => {
		if (step > 1) {
			setStep(step - 1); // 2단계라면 1단계로 이동
		} else {
			navigate(-1); // 1단계라면 이전 페이지(로그인 등)로 이동
		}
	};

	// Signup 완료 버튼 클릭 시
	const handleSignup = async () => {
		// 명세에 명시된 필수 필드 3개 구성
		const requestBody = {
			email: values.email,
			password: values.password,
			name: values.nickname, // 명세서의 'name' 필드에 우리 'nickname'을 매칭
			avatar: null, // 선택 사항 (필요 없으면 제외 가능)
			bio: null, // 선택 사항
		};

		try {
			const response = await fetch("http://localhost:8000/v1/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					accept: "application/json",
				},
				body: JSON.stringify(requestBody),
			});

			if (response.status === 201) {
				console.log("회원가입 성공!");
				alert("회원가입 성공!");
				navigate("/");
			}
		} catch (error) {
			console.error("통신 에러:", error);
			alert("에러");
		}
	};

	// 1단계에서는 이메일 에러가 없고 값이 있을 때만 '다음' 활성화
	const canGoNext = !iderror && values.email.length > 0;
	// 2단계는 기존 canlogin 로직 활용 (필요시 비밀번호 일치 로직 추가 가능)
	const canSubmit = canlogin && values.password === values.confirmPassword;

	return (
		<div className="flex flex-col items-center justify-center mt-20 px-4 text-white">
			<div className="w-full max-w-md flex flex-col gap-6">
				{/* 상단 헤더 */}
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

				{/* 2단계일 때만 상단에 고정되는 아이디(이메일) 표시 */}
				{step === 2 && (
					<div className="w-full p-4 bg-gray-800 rounded-xl border border-purple-500/50 flex flex-col gap-1">
						<span className="text-gray-400 text-xs">아이디</span>
						<span className="font-bold text-lg">{values.email}</span>
					</div>
				)}

				<div className="flex flex-col gap-4">
					{/* --- 1단계: 이메일 입력 --- */}
					{step === 1 && (
						<>
							<input
								type="text"
								name="email"
								value={values.email}
								onChange={handleChange}
								placeholder="이메일을 입력해주세요"
								className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-800 focus:border-purple-500 focus:outline-none transition-all"
							/>
							{iderror && (
								<p className="text-red-500 text-xs mt-1 ml-2">
									올바른 이메일 형식을 입력해주세요.
								</p>
							)}
							<button
								type="button"
								disabled={!canGoNext}
								onClick={() => setStep(2)}
								className={`w-full py-4 mt-2 font-bold rounded-xl transition-all ${
									canGoNext
										? "bg-purple-600 text-white"
										: "bg-gray-800 text-gray-500"
								}`}
							>
								다음
							</button>
						</>
					)}

					{/* --- 2단계: 비밀번호 입력 --- */}
					{step === 2 && (
						<>
							<div className="relative w-full">
								<input
									type={showPw ? "text" : "password"}
									name="password"
									value={values.password}
									onChange={handleChange}
									placeholder="비밀번호를 입력해주세요"
									className="w-full p-4 pr-12 bg-gray-900 text-white rounded-xl border border-gray-800 focus:border-purple-500 focus:outline-none transition-all"
								/>
								<button
									type="button"
									onClick={() => setshowPw(!showPw)} // 클릭 시 반전
									className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300"
								>
									{showPw ? "숨기기" : "보기"}
								</button>
							</div>
							{pwerror && (
								<p className="text-red-500 text-xs mt-1 ml-2">
									비밀번호는 8-20글자로 설정 해야 합니다.
								</p>
							)}
							<div className="relative w-full">
								<input
									type={showPwr ? "text" : "password"}
									name="confirmPassword"
									value={values.confirmPassword}
									onChange={handleChange}
									placeholder="비밀번호를 한 번 더 입력해주세요"
									className="w-full p-4 pr-12 bg-gray-900 text-white rounded-xl border border-gray-800 focus:border-purple-500 focus:outline-none transition-all"
								/>
								<button
									type="button"
									onClick={() => setshowPwr(!showPwr)} // 클릭 시 반전
									className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300"
								>
									{showPwr ? "숨기기" : "보기"}
								</button>
							</div>
							{checkpw && ( // false면 불일치
								<p className="text-red-500 text-xs mt-1 ml-2">
									비밀번호가 일치하지 않습니다.
								</p>
							)}
							<button
								type="button"
								disabled={!canSubmit}
								onClick={() => setStep(3)}
								className={`w-full py-4 mt-2 font-bold rounded-xl transition-all ${
									canSubmit
										? "bg-purple-600 text-white shadow-lg"
										: "bg-gray-800 text-gray-500"
								}`}
							>
								다음
							</button>
						</>
					)}
				</div>
				{/* --- 3단계 : 닉네임 입력 후 회원가입 완료 --- */}
				{step === 3 && (
					<div className="flex flex-col items-center gap-8 animate-fadeIn">
						{/* 프로필 이미지 섹션 (기본 이미지) */}
						<div className="flex flex-col items-center gap-3">
							<div className="w-28 h-28 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700 shadow-inner">
								{/* 임시 기본 아이콘/이모지 */}
								<span className="text-5xl">👤</span>
							</div>
						</div>

						{/* 닉네임 입력 섹션 */}
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
									name="nickname"
									value={values.nickname}
									onChange={handleChange}
									placeholder="닉네임을 입력해주세요"
									className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-800 focus:border-purple-500 focus:outline-none transition-all"
								/>
							</div>

							<button
								type="button"
								// 닉네임이 비어있지 않을 때만 활성화 (필요시 글자수 조건 추가)
								disabled={values.nickname.length === 0}
								onClick={handleSignup}
								className={`w-full py-4 mt-4 font-bold rounded-xl transition-all ${
									values.nickname.length > 0
										? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
										: "bg-gray-800 text-gray-500 cursor-not-allowed"
								}`}
							>
								회원가입 완료
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
