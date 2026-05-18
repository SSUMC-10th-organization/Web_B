import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getMyInfo, postLogout } from "../apis/auth";
import { toast } from "../components/Toast";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { ResponseMyInfoDto } from "../types/auth";

type NavbarProps = {
  toggleSidebar?: () => void;
  onSearchOpen?: () => void;
};

const Navbar = ({ toggleSidebar, onSearchOpen }: NavbarProps) => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const { removeItem: removeAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken,
  );
  const { removeItem: removeRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken,
  );

  const { data: userInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
    select: (data: ResponseMyInfoDto) => data.data,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: logout } = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      removeAccessToken();
      removeRefreshToken();
      queryClient.clear();
      toast.info("로그아웃 되었습니다.");
      window.location.href = "/";
    },
    onError: () => {
      toast.error("로그아웃에 실패했습니다.");
    },
  });

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-black text-white sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* 햄버거 버튼 */}
        {accessToken && (
          <button
            type="button"
            className="hover:text-[#e91e8c] transition-colors"
            onClick={toggleSidebar}
            aria-label="메뉴 열기"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M6 36v-3h36v3H6Zm0-10.5v-3h36v3H6ZM6 15v-3h36v3H6Z" />
            </svg>
          </button>
        )}
        <Link
          to="/"
          className="text-[#e91e8c] font-bold text-lg tracking-tight"
        >
          돌려돌려LP판
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* 찾기 아이콘 - 클릭 시 SearchPanel 열기 */}
        <button
          type="button"
          onClick={onSearchOpen}
          className="hover:text-[#e91e8c] transition-colors"
          aria-label="검색"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {!accessToken ? (
          <>
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm border border-gray-600 rounded hover:border-gray-400 transition-colors"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1.5 text-sm bg-[#e91e8c] rounded hover:bg-[#c2185b] transition-colors"
            >
              회원가입
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm font-medium">
              {userInfo?.name || "회원"}님 반갑습니다.
            </span>
            <button
              type="button"
              onClick={() => logout()}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
