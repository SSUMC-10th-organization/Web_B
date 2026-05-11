import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { deleteUser } from "../apis/auth";
import ConfirmModal from "../components/ConfirmModal";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { toast } from "../components/toast";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const { removeItem: removeAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken,
  );
  const { removeItem: removeRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken,
  );

  useEffect(() => {
    if (!accessToken) {
      toast.error("로그인이 필요한 서비스입니다.");
    }
  }, [accessToken]);

  const { mutate: withdraw } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      removeAccessToken();
      removeRefreshToken();
      queryClient.clear();
      toast.success("탈퇴가 완료되었습니다.");
      navigate("/login");
    },
    onError: () => {
      toast.error("탈퇴에 실패했습니다.");
    },
  });

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Navbar toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex flex-1 relative overflow-hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`
						fixed top-0 left-0 z-50
						w-56 h-full
						bg-[#0a0a0a] border-r border-gray-800
						flex flex-col
						transform transition-transform duration-300 ease-in-out
						${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
					`}
        >
          <div className="p-6 flex flex-col gap-4 pt-8 flex-1">
            <Link
              to="/search"
              onClick={() => setIsSidebarOpen(false)}
              className="text-sm hover:text-[#e91e8c] flex items-center gap-2 transition-colors"
            >
              🔍 찾기
            </Link>
            <Link
              to="/mypage"
              onClick={() => setIsSidebarOpen(false)}
              className="text-sm hover:text-[#e91e8c] flex items-center gap-2 transition-colors"
            >
              👤 마이페이지
            </Link>
          </div>

          <div className="p-6">
            <button
              type="button"
              onClick={() => {
                setIsSidebarOpen(false);
                setIsWithdrawModalOpen(true);
              }}
              className="text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              탈퇴하기
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 relative min-w-0">
          <Outlet />
        </main>
      </div>

      <Footer />

      {isWithdrawModalOpen && (
        <ConfirmModal
          message="정말 탈퇴하시겠습니까?"
          onConfirm={() => {
            setIsWithdrawModalOpen(false);
            withdraw();
          }}
          onCancel={() => setIsWithdrawModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProtectedLayout;
