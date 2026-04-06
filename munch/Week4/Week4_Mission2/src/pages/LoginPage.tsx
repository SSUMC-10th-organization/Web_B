import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import validateSignin, { type UserSigninInformation } from "../utils/validate";

const LoginPage = () => {
  const navigate = useNavigate();
  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: { email: "", password: "" },
      validate: validateSignin,
    });

  const handleSubmit = () => {
    console.log(values);
  };

  const isDisabled =
    Object.values(errors || {}).some((e) => e.length > 0) ||
    Object.values(values).some((v) => v === "");

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-[340px] flex flex-col gap-4">
        {/* 헤더: 뒤로가기 + 타이틀 */}
        <div className="flex items-center mb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-xl p-1 hover:text-[#e91e8c] transition-colors"
          >
            ‹
          </button>
          <span className="flex-1 text-center text-white text-lg font-semibold">
            로그인
          </span>
          {/* 오른쪽 균형 맞추기용 */}
          <div className="w-7" />
        </div>

        {/* 구글 로그인 */}
        <button className="flex items-center justify-center gap-3 w-full border border-gray-600 text-white py-2.5 rounded hover:border-gray-400 transition-colors bg-transparent">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          구글 로그인
        </button>

        {/* OR 구분선 */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        {/* 이메일 입력 */}
        <div className="flex flex-col gap-1">
          <input
            {...getInputProps("email")}
            type="email"
            placeholder="이메일을 입력해주세요!"
            className={`w-full bg-transparent border px-3 py-2.5 rounded text-white text-sm placeholder-gray-500 outline-none transition-colors
              ${
                errors?.email && touched?.email
                  ? "border-[#e91e8c] focus:border-[#e91e8c]"
                  : "border-gray-600 focus:border-[#807bff]"
              }`}
          />
          {errors?.email && touched?.email && (
            <p className="text-[#e91e8c] text-xs">{errors.email}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="flex flex-col gap-1">
          <input
            {...getInputProps("password")}
            type="password"
            placeholder="비밀번호를 입력해주세요!"
            className={`w-full bg-transparent border px-3 py-2.5 rounded text-white text-sm placeholder-gray-500 outline-none transition-colors
              ${
                errors?.password && touched?.password
                  ? "border-[#e91e8c] focus:border-[#e91e8c]"
                  : "border-gray-600 focus:border-[#807bff]"
              }`}
          />
          {errors?.password && touched?.password && (
            <p className="text-[#e91e8c] text-xs">{errors.password}</p>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full py-2.5 rounded text-sm font-medium transition-colors
            disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed
            bg-[#e91e8c] text-white hover:bg-[#c2185b] cursor-pointer"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
