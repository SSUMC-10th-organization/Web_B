import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";
import { useState } from "react";
import { Sidebar } from "./Sidebar";

export const Navbar = () => {
  const { accessToken, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 bg-[#111] border-b border-[#222]">
        {/* 왼쪽: 햄버거 버튼 */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-white hover:text-[#ccc] transition-colors"
          aria-label="메뉴 열기"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M7.95 11.95h32m-32 12h32m-32 12h32"
            />
          </svg>
        </button>

        {/* 가운데: 로고 */}
        <Link to="/" className="text-white font-bold text-base tracking-tight">
          LP
        </Link>

        {/* 오른쪽: 로그인 상태 */}
        <div className="flex items-center gap-2">
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
                className="px-4 py-1.5 text-sm text-black bg-white rounded-md hover:bg-[#ccc] transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
          {accessToken && data?.data && (
            <>
              <Link
                to="/my"
                className="px-4 py-1.5 text-sm text-black bg-white rounded-md hover:bg-[#ccc] transition-colors"
              >
                {data.data.name}님 반갑습니다.
              </Link>
              <button
                onClick={logout}
                className="px-4 py-1.5 text-sm text-black bg-white rounded-md hover:bg-[#ccc] transition-colors"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};
