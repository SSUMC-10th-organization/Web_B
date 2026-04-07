import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninformation } from "../utils/validate";

export const LoginPage = () => {
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninformation>({
      initialValue: { email: "", password: "" },
      validate: validateSignin,
    });

  const handleSubmit = () => {
    console.log(values);
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-[320px]">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-7">
          <button
            onClick={() => navigate("/")}
            className="text-black text-2xl leading-none cursor-pointer hover:text-gray-300 transition-colors"
          >
            &#8249;
          </button>
          <h1 className="text-black text-xl font-semibold tracking-tight">
            로그인
          </h1>
        </div>

        {/* 이메일 */}
        <div className="mb-2.5">
          <input
            {...getInputProps("email")}
            type="email"
            placeholder="이메일을 입력해주세요!"
            className={`w-full bg-transparent border rounded-lg px-4 py-3 text-white text-sm placeholder-[#555] outline-none transition-colors focus:border-[#555]
              ${
                errors?.email && touched?.email
                  ? "border-red-500"
                  : "border-[#333]"
              }`}
          />
          {errors?.email && touched?.email && (
            <p className="text-red-400 text-xs mt-1 px-1">{errors.email}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
          <input
            {...getInputProps("password")}
            type="password"
            placeholder="비밀번호를 입력해주세요!"
            className={`w-full bg-transparent border rounded-lg px-4 py-3 text-white text-sm placeholder-[#555] outline-none transition-colors focus:border-[#555]
              ${
                errors?.password && touched?.password
                  ? "border-red-500"
                  : "border-[#333]"
              }`}
          />
          {errors?.password && touched?.password && (
            <p className="text-red-400 text-xs mt-1 px-1">{errors.password}</p>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer
            disabled:bg-[#222] disabled:border disabled:border-[#333] disabled:text-[#555] disabled:cursor-not-allowed
            enabled:bg-[#ff2d87] enabled:text-white enabled:hover:bg-[#e0206f]"
        >
          로그인
        </button>
      </div>
    </div>
  );
};
