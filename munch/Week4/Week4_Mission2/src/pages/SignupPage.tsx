import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type UserSignupInformation } from "../utils/validate";
import useLocalStorage from "../hooks/useLocalStorage";

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [, setStoredUser] = useLocalStorage<UserSignupInformation | null>(
    "user",
    null,
  );

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<UserSignupInformation>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      nickname: "",
    },
  });

  const emailValue = watch("email");

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handleNextStep = async (
    fieldsToValidate: (keyof UserSignupInformation)[],
  ) => {
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  // 최종 회원가입 완료 로직
  const onSubmit = (data: UserSignupInformation) => {
    console.log("회원가입 완료 데이터:", data);
    setStoredUser(data);
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-[340px] flex flex-col gap-4">
        <div className="flex items-center mb-2">
          <button
            onClick={handleBack}
            className="text-white text-xl p-1 hover:text-[#e91e8c] transition-colors"
          >
            ‹
          </button>
          <span className="flex-1 text-center text-white text-lg font-semibold">
            회원가입
          </span>
          <div className="w-7" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {step === 1 && (
            <>
              <div className="flex flex-col gap-1">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="이메일을 입력해주세요!"
                  className={`w-full bg-transparent border px-3 py-2.5 rounded text-white text-sm placeholder-gray-500 outline-none transition-colors
                    ${errors.email ? "border-[#e91e8c] focus:border-[#e91e8c]" : "border-gray-600 focus:border-[#807bff]"}`}
                />
                {errors.email && (
                  <p className="text-[#e91e8c] text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleNextStep(["email"])}
                disabled={!!errors.email || !emailValue}
                className="w-full py-2.5 rounded text-sm font-medium transition-colors mt-2 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed bg-[#e91e8c] text-white hover:bg-[#c2185b]"
              >
                다음
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center justify-center text-sm text-gray-300 mb-2">
                <span className="mr-2">✉️</span> {emailValue}
              </div>

              <div className="flex flex-col gap-1 relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요!"
                  className={`w-full bg-transparent border px-3 py-2.5 rounded text-white text-sm placeholder-gray-500 outline-none transition-colors pr-10
                    ${errors.password ? "border-[#e91e8c] focus:border-[#e91e8c]" : "border-gray-600 focus:border-[#807bff]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white text-sm"
                >
                  <i
                    className={
                      showPassword
                        ? "fa-solid fa-eye-slash"
                        : "fa-regular fa-eye"
                    }
                  ></i>
                </button>
                {errors.password && (
                  <p className="text-[#e91e8c] text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1 relative">
                <input
                  {...register("passwordConfirm")}
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="비밀번호를 다시 한 번 입력해주세요!"
                  className={`w-full bg-transparent border px-3 py-2.5 rounded text-white text-sm placeholder-gray-500 outline-none transition-colors pr-10
                    ${errors.passwordConfirm ? "border-[#e91e8c] focus:border-[#e91e8c]" : "border-gray-600 focus:border-[#807bff]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white text-sm"
                >
                  <i
                    className={
                      showPasswordConfirm
                        ? "fa-solid fa-eye-slash"
                        : "fa-regular fa-eye"
                    }
                  ></i>
                </button>
                {errors.passwordConfirm && (
                  <p className="text-[#e91e8c] text-xs mt-1">
                    {errors.passwordConfirm.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleNextStep(["password", "passwordConfirm"])}
                className="w-full py-2.5 rounded text-sm font-medium transition-colors mt-2 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed bg-[#e91e8c] text-white hover:bg-[#c2185b]"
              >
                다음
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <input
                  {...register("nickname")}
                  type="text"
                  placeholder="닉네임을 입력해주세요!"
                  className={`w-full bg-transparent border px-3 py-2.5 rounded text-white text-sm placeholder-gray-500 outline-none transition-colors
                    ${errors.nickname ? "border-[#e91e8c] focus:border-[#e91e8c]" : "border-gray-600 focus:border-[#807bff]"}`}
                />
                {errors.nickname && (
                  <p className="text-[#e91e8c] text-xs mt-1">
                    {errors.nickname.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className="w-full py-2.5 rounded text-sm font-medium transition-colors mt-2 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed bg-[#e91e8c] text-white hover:bg-[#c2185b]"
              >
                회원가입 완료
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
