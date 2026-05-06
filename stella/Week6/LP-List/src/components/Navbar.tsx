import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import type { ResponseMyInfoDto } from "../types/auth";
import { getMyInfo } from "../apis/auth";

export const Navbar = () => {
  const { accessToken } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto>([]);

  useEffect(() => {
    // 토큰이 있을 때만 내 정보를 불러오는 로직을 실행합니다.
    if (accessToken) {
      const fetchMyInfo = async () => {
        try {
          const response = await getMyInfo(); // 실제 API 호출 함수로 변경해주세요.
          setData(response.data); // 콘솔창 확인 후 알맞은 데이터 경로를 넣어주세요.
        } catch (error) {
          console.error("내 정보를 불러오는데 실패했습니다.", error);
        }
      };
      fetchMyInfo();
    }
  }, [accessToken]);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#111] border-b border-[#222]">
      <Link to="/" className="text-white font-bold text-base tracking-tight">
        LP
      </Link>
      <div className="flex gap-2">
        {!accessToken && (
          <>
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm text-[#ccc] border border-[#444] rounded-md hover:bg-[#1a1a1a] transition-colors"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1.5 text-sm text-black bg-white border-[#444] rounded-md hover:bg-[#ccc] transition-colors"
            >
              회원가입
            </Link>
          </>
        )}
        {accessToken && (
          <Link
            to="/my"
            className="px-4 py-1.5 text-sm text-black bg-white border-[#444] rounded-md hover:bg-[#ccc] transition-colors"
          >
            {data.name}님 환영합니다.
          </Link>
        )}

        <Link
          to="/search"
          className="px-4 py-1.5 text-sm text-black bg-white border-[#444] rounded-md hover:bg-[#ccc] transition-colors"
        >
          검색
        </Link>
      </div>
    </nav>
  );
};
