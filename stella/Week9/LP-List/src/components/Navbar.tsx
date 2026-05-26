import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";
import { Sidebar } from "./Sidebar";
import { useSidebar } from "../hooks/useSidebar";

export const Navbar = () => {
  const { accessToken, logout } = useAuth();
  const { isOpen: isSidebarOpen, toggle: toggleSidebar, close: closeSidebar } = useSidebar();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["myInfo"] });
      window.location.href = "/login";
    },
    onError: () => {
      alert("로그아웃에 실패했습니다.");
    },
  });

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 bg-[#111] border-b border-[#222]">
        <button
          onClick={toggleSidebar}
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

        <Link to="/" className="text-white font-bold text-base tracking-tight">
          LP
        </Link>

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
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="px-4 py-1.5 text-sm text-[#ccc] border border-[#444] rounded-md hover:bg-[#1a1a1a] transition-colors"
              >
                {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
              </button>
            </>
          )}
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
};
