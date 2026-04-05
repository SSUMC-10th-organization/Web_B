import { useNavigate, Link } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const {values,iderror,pwerror,canlogin,handleChange} = useForm({email:'',password:''});
  const navigate = useNavigate();
  const {setTokenA, setTokenR,setNick} = useAuth();

  const handleLogin = async () => {
  const body = {
    email: values.email, // useForm에서 받은 값
    password: values.password,
  };


  try {
    const response = await fetch("http://localhost:8000/v1/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (response.status === 201) {
      //여기서 토큰을 브라우저 저장소에 '박제'해야 함
      const { accessToken, refreshToken, name } = result.data;
      setTokenA(accessToken);
      setTokenR(refreshToken);
      setNick(name);

      alert(`${result.data.name}님, 환영합니다!`);
      navigate("/"); // 로그인 성공 후 이동
    } else {
      alert("로그인 실패");
    }
  } catch (error) {
    alert("통신 에러:");
  }
};

  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4 text-white">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* 상단 헤더: < 는 왼쪽 끝 고정, '로그인'은 전체의 중앙 */}
        <div className="relative flex items-center justify-center w-full mb-4">
          <button
            type = "button" 
            onClick={()=> navigate(-1)} 
            className="absolute left-0 text-3xl font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            &lt;
          </button>
          <h1 className="text-2xl font-bold">로그인</h1>
        </div>

        {/* 구글 로그인 버튼 */}
        <button type = 'button' className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center shadow-sm">
          구글 로그인
        </button>

        {/* 구분선 (- or -) */}
        <div className="flex items-center justify-center gap-4 text-gray-500 font-medium px-2">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span>or</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        {/* 입력창 및 로그인 버튼 */}
        <div className="flex flex-col gap-4">
          <input 
            type="text"
            name = 'email'
            value = {values.email}
            onChange = {handleChange}  
            placeholder="아이디를 입력해주세요" 
            className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-800 focus:border-purple-500 focus:outline-none transition-all"
          />
          {iderror && (
            <p className="text-red-500 text-xs mt-2 ml-2">
              올바른 이메일 형식을 입력해주세요.
            </p>
          )}
          <input 
            type="password"
            name = 'password'
            value = {values.password}
            onChange = {handleChange}  
            placeholder="비밀번호를 입력해주세요" 
            className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-800 focus:border-purple-500 focus:outline-none transition-all"
          />
          {pwerror && (
            <p className="text-red-500 text-xs mt-2 ml-2">
              비밀번호는 8자리 이상 입력해야합니다.
            </p>
          )}
          <button type = 'button' disabled={!canlogin} onClick={handleLogin} className={`w-full py-4 font-bold rounded-xl transition-all ${
    canlogin 
      ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg" 
      : "bg-gray-800 text-gray-500 cursor-not-allowed"
  }`}>
            로그인
          </button>
        </div>

      </div>
    </div>
  );
};